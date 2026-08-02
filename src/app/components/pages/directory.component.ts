import { Component, OnInit, OnDestroy } from '@angular/core';
import { RechercheService } from 'src/app/services/recherche/recherche.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { ContactService } from 'src/app/services/contact/contact.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit, OnDestroy {

  professionals: any[] = [];
  filteredProfessionals: any[] = [];
  specialties: any[] = [];

  currentUser: any = null;
  isLoggedIn = false;

  searchText = '';
  selectedSpecialty = '';
  sortBy = 'name';

  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  viewMode: 'grid' | 'list' = 'grid';
  gridCols: 2 | 3 = 3;

  loading = true;
  favoritesList: number[] = [];

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private rechercheService: RechercheService,
    private specialiteService: SpecialiteService,
    private storageService: StorageService,
    private favorisService: FavorisService,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.isLoggedIn = !!this.currentUser;
    this.loadSpecialties();
    this.loadProfessionals();
    if (this.isLoggedIn) this.loadFavorites();
    this.setupSearch();
  }

  loadSpecialties(): void {
    this.specialiteService.AfficherListeSPecialite()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => { this.specialties = Array.isArray(data) ? data : []; },
        error: () => {}
      });
  }

  loadProfessionals(): void {
    this.loading = true;
    const nom = this.searchText.trim() || undefined;
    const specialiteId = this.selectedSpecialty ? +this.selectedSpecialty : undefined;

    this.rechercheService.rechercherProfessionnels(nom, specialiteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.professionals = Array.isArray(data) ? data : [];
          this.applyFilters();
          this.loading = false;
        },
        error: () => { this.professionals = []; this.loading = false; }
      });
  }

  loadFavorites(): void {
    this.favorisService.getMesFavoris()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.favoritesList = (Array.isArray(data) ? data : []).map((f: any) => f.favorit?.id ?? f.id);
        },
        error: () => {}
      });
  }

  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => { this.currentPage = 1; this.loadProfessionals(); });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
    this.searchSubject.next(value);
  }

  onSpecialtyChange(): void {
    this.currentPage = 1;
    this.loadProfessionals();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.professionals];
    if (this.sortBy === 'viewed') {
      result.sort((a, b) => (b.nombreVues || 0) - (a.nombreVues || 0));
    } else {
      result.sort((a, b) => ((a.prenom || '') + (a.nom || '')).localeCompare((b.prenom || '') + (b.nom || '')));
    }
    this.filteredProfessionals = result;
    this.totalPages = Math.ceil(result.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPaginatedProfessionals(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProfessionals.slice(start, start + this.itemsPerPage);
  }

  goToProfile(professional: any): void {
    if (professional?.tokenPartage) {
      this.router.navigate(['/professionnel', professional.tokenPartage]);
    }
  }

  toggleFavorite(professional: any, event: Event): void {
    event.stopPropagation();
    if (!this.isLoggedIn) {
      Swal.fire({ title: 'Connexion requise', text: 'Connectez-vous pour gérer vos favoris', icon: 'info', heightAuto: false });
      return;
    }
    const id: number = professional.id;
    if (this.isFavori(id)) {
      this.favorisService.retirerFavori(id).subscribe({
        next: () => { this.favoritesList = this.favoritesList.filter(fid => fid !== id); },
        error: () => Swal.fire({ title: 'Erreur', icon: 'error', heightAuto: false })
      });
    } else {
      this.favorisService.ajouterFavori(id).subscribe({
        next: () => { this.favoritesList.push(id); },
        error: () => Swal.fire({ title: 'Erreur', icon: 'error', heightAuto: false })
      });
    }
  }

  sendContactRequest(professional: any, event: Event): void {
    event.stopPropagation();
    if (!this.isLoggedIn) {
      Swal.fire({ title: 'Connexion requise', text: 'Connectez-vous pour envoyer une demande', icon: 'info', heightAuto: false });
      return;
    }
    this.contactService.envoyerDemande(professional.id).subscribe({
      next: () => Swal.fire({ title: 'Demande envoyée !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false }),
      error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible d\'envoyer la demande', icon: 'error', heightAuto: false })
    });
  }

  isFavori(id: number): boolean { return this.favoritesList.includes(id); }

  generateImageUrl(nom: string): string {
    if (!nom) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    return base + (nom.startsWith('/') ? nom : '/' + nom);
  }

  handleImageError(event: any): void { event.target.src = 'assets/img/team/amadou.jpg'; }

  previousPage(): void { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToPage(page: number): void { if (page >= 1 && page <= this.totalPages) this.currentPage = page; }

  getPaginationArray(): number[] {
    const pages: number[] = [];
    const max = 5;
    let start = Math.max(1, this.currentPage - Math.floor(max / 2));
    const end = Math.min(this.totalPages, start + max - 1);
    if (end - start < max - 1) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
