import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-plus-vus',
  templateUrl: './plus-vus.component.html',
  styleUrls: ['./plus-vus.component.scss']
})
export class PlusVusComponent implements OnInit {

  profils: any[] = [];
  loading = true;
  isLoggedIn = false;

  constructor(
    private userService: UserService,
    private favorisService: FavorisService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.chargerPlusVus();
  }

  chargerPlusVus(): void {
    this.loading = true;
    this.userService.getPlusVus().subscribe({
      next: (data) => {
        this.profils = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: () => {
        this.profils = [];
        this.loading = false;
      }
    });
  }

  voirProfil(token: string): void {
    if (token) {
      this.router.navigate(['/professionnel', token]);
    }
  }

  ajouterFavori(idUser: number): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/connexion']);
      return;
    }
    this.favorisService.ajouterFavori(idUser).subscribe({
      next: () => {
        Swal.fire({ title: 'Ajouté aux favoris !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
      },
      error: (err) => {
        Swal.fire({ title: 'Info', text: err?.error?.message || 'Action impossible.', icon: 'info', heightAuto: false });
      }
    });
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

  getRangBadge(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  }

  getRangClass(index: number): string {
    if (index === 0) return 'rang-or';
    if (index === 1) return 'rang-argent';
    if (index === 2) return 'rang-bronze';
    return '';
  }
}
