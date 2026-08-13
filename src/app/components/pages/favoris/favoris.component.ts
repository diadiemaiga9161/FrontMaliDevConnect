import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.scss']
})
export class FavorisComponent implements OnInit {

  favoris: any[] = [];
  loading = true;
  searchTerm = '';

  constructor(
    private favorisService: FavorisService,
    private storageService: StorageService,
    private wsService: WebsocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerFavoris();
  }

  chargerFavoris(): void {
    this.loading = true;
    this.favorisService.getMesFavoris().subscribe({
      next: (data) => {
        // backend retourne [{favorit: User}, ...] — on unwrap pour accès direct
        this.favoris = Array.isArray(data) ? data.map((f: any) => f.favorit || f) : [];
        this.loading = false;
      },
      error: () => {
        this.favoris = [];
        this.loading = false;
      }
    });
  }

  retirerFavori(idUser: number, nomPrenom: string): void {
    Swal.fire({
      title: 'Retirer des favoris ?',
      text: `Voulez-vous retirer ${nomPrenom} de vos favoris ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, retirer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444',
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.favorisService.retirerFavori(idUser).subscribe({
          next: () => {
            Swal.fire({ title: 'Retiré !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
            this.chargerFavoris();
          },
          error: () => {
            Swal.fire({ title: 'Erreur', text: 'Impossible de retirer ce favori.', icon: 'error', heightAuto: false });
          }
        });
      }
    });
  }

  voirProfil(token: string): void {
    if (token) {
      this.router.navigate(['/professionnel', token]);
    }
  }

  envoyerMessage(userId: number): void {
    this.router.navigate(['/chat', userId]);
  }

  generateImageUrl(nom: string): string {
    if (!nom) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    const path = nom.startsWith('/') ? nom : '/' + nom;
    return base + path;
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/img/team/amadou.jpg';
  }

  isOnline(email: string | undefined | null): boolean {
    return this.wsService.estEnLigne(email);
  }

  get favorisFiltres(): any[] {
    if (!this.searchTerm.trim()) return this.favoris;
    const term = this.searchTerm.toLowerCase();
    return this.favoris.filter(f =>
      (f.nom || '').toLowerCase().includes(term) ||
      (f.prenom || '').toLowerCase().includes(term) ||
      (f.specialite?.specialite || '').toLowerCase().includes(term)
    );
  }
}
