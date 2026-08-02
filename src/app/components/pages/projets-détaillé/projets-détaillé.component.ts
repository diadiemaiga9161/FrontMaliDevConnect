import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { ProjetService } from 'src/app/services/projet/projet.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-projets-détaillé',
  templateUrl: './projets-détaillé.component.html',
  styleUrls: ['./projets-détaillé.component.scss']
})
export class ProjetsDétailléComponent implements OnInit {
  projetId: number | null = null;
  projet: any = null;
  autresProjets: any[] = [];
  photoActive: string = '';
  errorMessage = '';
  loading = true;
  isLoggedIn = false;
  carouselPage = 0;
  readonly CAROUSEL_PER_PAGE = 3;

  get carouselSlice(): any[] {
    const start = this.carouselPage * this.CAROUSEL_PER_PAGE;
    return this.autresProjets.slice(start, start + this.CAROUSEL_PER_PAGE);
  }
  get carouselTotalPages(): number {
    return Math.ceil(this.autresProjets.length / this.CAROUSEL_PER_PAGE);
  }
  get carouselDots(): number[] {
    return Array.from({ length: this.carouselTotalPages }, (_, i) => i);
  }
  carouselPrev(): void { if (this.carouselPage > 0) this.carouselPage--; }
  carouselNext(): void { if (this.carouselPage < this.carouselTotalPages - 1) this.carouselPage++; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private projetService: ProjetService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();
    this.isLoggedIn = !!(user && user.token);

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && !isNaN(Number(id)) && Number(id) > 0) {
        this.projetId = Number(id);
        this.chargerProjet();
      } else {
        this.errorMessage = 'Projet introuvable';
        this.loading = false;
      }
    });
  }

  chargerProjet(): void {
    this.loading = true;
    this.userService.AfficherProjetInformatiqueParId(this.projetId!).subscribe({
      next: (data) => {
        this.projet = data;
        // Photo principale : première photo du tableau ou photo de couverture
        const photos = data?.photos || data?.projetPhotos || [];
        const firstPhoto = photos[0];
        this.photoActive = firstPhoto ? (firstPhoto.chemin || firstPhoto.nom || '') : (data?.photo || '');

        // Charger les autres projets du même type
        this.carouselPage = 0;
        const typeId = data?.typeProjet?.id;
        if (typeId) {
          this.projetService.getProjetsByTypeId(typeId, this.projetId!).subscribe({
            next: (projets) => {
              this.autresProjets = projets || [];
            },
            error: () => { this.autresProjets = []; }
          });
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.status === 404 ? 'Projet non trouvé' : 'Erreur de chargement';
        this.loading = false;
      }
    });
  }

  get photosProjet(): any[] {
    return this.projet?.photos || this.projet?.projetPhotos || [];
  }

  setPhotoActive(nom: string): void {
    this.photoActive = nom;
  }

  generateImageUrl(photoFileName: string): string {
    if (!photoFileName) return 'assets/img/team/amadou.jpg';
    return `${URL_PHOTO}${photoFileName}`;
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/img/team/amadou.jpg';
  }

  retourListe(): void {
    window.history.back();
  }

  voirProfessionnel(): void {
    const token = this.projet?.user?.tokenPartage;
    if (token) {
      this.router.navigate(['/professionnel', token]);
    }
  }

  voirProjet(id: number): void {
    if (id) this.router.navigate(['/projets-détaillé', id]);
  }
}
