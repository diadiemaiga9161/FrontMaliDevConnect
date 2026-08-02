import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user/user.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { RechercheService } from 'src/app/services/recherche/recherche.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { ContactService } from 'src/app/services/contact/contact.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-professionnel',
  templateUrl: './professionnel.component.html',
  styleUrls: ['./professionnel.component.scss']
})
export class ProfessionnelComponent implements OnInit {
  isLoading: boolean = true;
  erreurChargement: boolean = false;
  professionnels: any[] = [];
  specialite: any[] = [];
  connaissance: any[] = [];
  searchTextSpecialite: string = '';
  searchTextConnaissance: string = '';
  searchTextNom: string = '';
  sortPlusVus: boolean = false;
  private professionnelsOriginal: any[] = [];
  p: number = 1;

  currentUser: any = null;
  isLoggedIn = false;
  favoritesList: number[] = [];

  openSidebar: boolean = false;
  OpenFilter: Boolean = false;
  public col_xl_3: boolean = true;
  public xl_4: boolean = true;
  public col_xl_4: boolean = false;
  public col_sm_4: boolean = false;
  public col_xl_6: boolean = false;
  public col_sm_6: boolean = true;
  public col_xl_2: boolean = false;
  public col_xl_12: boolean = false;
  public col_sm_3: boolean = false;
  public listView: boolean = false;
  public gridOptions: boolean = true;

  generateImageUrl(photoFileName: string): string {
    if (!photoFileName) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    const path = photoFileName.startsWith('/') ? photoFileName : '/' + photoFileName;
    return base + path;
  }

  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/amadou.jpg';
  }

  constructor(
    private serviceUser: UserService,
    private rechercheService: RechercheService,
    private specialiteService: SpecialiteService,
    private connaissanceService: ConnaissanceService,
    private storageService: StorageService,
    private favorisService: FavorisService,
    private contactService: ContactService,
    public router: Router,
  ) { }

  gridCols: 2 | 3 = 3;

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.isLoggedIn = !!this.currentUser;
    this.isLoading = true;
    this.erreurChargement = false;

    if (this.isLoggedIn) this.loadFavorites();

    this.rechercheService.rechercherProfessionnels().subscribe({
      next: (data) => {
        this.professionnels = Array.isArray(data) ? data : [];
        this.professionnelsOriginal = [...this.professionnels];
        this.isLoading = false;
      },
      error: () => {
        this.professionnels = [];
        this.isLoading = false;
        this.erreurChargement = true;
      }
    });

    this.specialiteService.AfficherListeSPecialite().subscribe({
      next: (data) => { this.specialite = Array.isArray(data) ? data : []; },
      error: () => { this.specialite = []; }
    });

    this.connaissanceService.getToutesConnaissances().subscribe({
      next: (data) => { this.connaissance = Array.isArray(data) ? data : []; },
      error: () => { this.connaissance = []; }
    });
  }

  get filteredCount(): number {
    if (!this.professionnels?.length) return 0;
    let list: any[] = this.professionnels;
    if (this.searchTextNom) {
      const n = this.searchTextNom.toLowerCase();
      list = list.filter((u: any) =>
        (u?.nom || '').toLowerCase().includes(n) ||
        (u?.prenom || '').toLowerCase().includes(n)
      );
    }
    if (this.searchTextSpecialite) {
      list = list.filter((u: any) =>
        (u?.specialite?.specialite || '').toLowerCase().includes(this.searchTextSpecialite.toLowerCase())
      );
    }
    if (this.searchTextConnaissance) {
      list = list.filter((u: any) =>
        (u?.connaissances || []).some((c: any) =>
          (c?.nom || '').toLowerCase().includes(this.searchTextConnaissance.toLowerCase())
        )
      );
    }
    return list.length;
  }

  goToDettailProfessionnel(token: string | undefined, id?: number): Promise<boolean> {
    const slug = token || (id != null ? String(id) : null);
    if (slug) return this.router.navigate(['professionnel', slug]);
    return Promise.resolve(false);
  }

  toggleSortPlusVus(): void {
    this.sortPlusVus = !this.sortPlusVus;
    this.p = 1;
    if (this.sortPlusVus) {
      this.professionnels = [...this.professionnelsOriginal]
        .sort((a, b) => (b.nombreVues || 0) - (a.nombreVues || 0));
    } else {
      this.professionnels = [...this.professionnelsOriginal];
    }
  }

  toggleListView(val: boolean) { this.listView = val; }
  sidebarToggle() { this.openSidebar = !this.openSidebar; }
  openFilter() { this.OpenFilter = !this.OpenFilter; }

  gridOpens() {
    this.listView = false; this.gridOptions = true;
    this.col_xl_3 = true; this.xl_4 = true;
    this.col_xl_4 = false; this.col_sm_4 = false;
    this.col_xl_6 = false; this.col_sm_6 = true;
    this.col_xl_2 = false; this.col_xl_12 = false;
  }
  listOpens() {
    this.listView = true; this.gridOptions = false;
    this.col_xl_3 = true; this.xl_4 = true;
    this.col_xl_12 = true; this.col_xl_2 = false;
    this.col_xl_4 = false; this.col_sm_4 = false;
    this.col_xl_6 = false; this.col_sm_6 = true;
  }

  // ── Favoris ──────────────────────────────────────────
  loadFavorites(): void {
    this.favorisService.getMesFavoris().subscribe({
      next: (data) => {
        this.favoritesList = (Array.isArray(data) ? data : []).map((f: any) => f.favorit?.id ?? f.id);
      },
      error: () => {}
    });
  }

  isFavori(id: number): boolean {
    return this.favoritesList.includes(id);
  }

  toggleFavori(pro: any, event: Event): void {
    event.stopPropagation();
    if (!this.isLoggedIn) {
      Swal.fire({ title: 'Connexion requise', text: 'Connectez-vous pour gérer vos favoris', icon: 'info', heightAuto: false });
      return;
    }
    const id: number = pro.id;
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

  // ── Contact ──────────────────────────────────────────
  sendContactRequest(pro: any, event: Event): void {
    event.stopPropagation();
    if (!this.isLoggedIn) {
      Swal.fire({ title: 'Connexion requise', text: 'Connectez-vous pour envoyer une demande', icon: 'info', heightAuto: false });
      return;
    }
    this.contactService.envoyerDemande(pro.id).subscribe({
      next: () => Swal.fire({ title: 'Demande envoyée !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false }),
      error: (err: any) => Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible d\'envoyer la demande', icon: 'error', heightAuto: false })
    });
  }
}
