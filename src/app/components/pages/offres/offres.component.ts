import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OffreEmploiService } from 'src/app/services/offre-emploi/offre-emploi.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-offres',
  templateUrl: './offres.component.html',
  styleUrls: ['./offres.component.scss']
})
export class OffresComponent implements OnInit {
  offres: any[] = [];
  offresFiltrees: any[] = [];
  specialites: any[] = [];
  loading = true;

  searchText = '';
  specialiteFiltre: number | null = null;

  constructor(
    private offreService: OffreEmploiService,
    private specialiteService: SpecialiteService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offreService.afficherToutes().subscribe({
      next: (data) => {
        this.offres = data || [];
        this.offresFiltrees = this.offres;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
    this.specialiteService.AfficherListeSPecialite().subscribe({ next: (d) => this.specialites = d || [], error: () => {} });
  }

  filtrer(): void {
    let list = [...this.offres];
    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      list = list.filter(o => (o.titre || '').toLowerCase().includes(q) || (o.entreprise?.nom || '').toLowerCase().includes(q));
    }
    if (this.specialiteFiltre) {
      list = list.filter(o => o.specialite?.id === this.specialiteFiltre);
    }
    this.offresFiltrees = list;
  }

  voirOffre(offre: any): void {
    this.router.navigate(['/offres', offre?.tokenPartage || offre?.id]);
  }

  generateImageUrl(nom: string | null | undefined): string {
    if (!nom) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    return base + (nom.startsWith('/') ? nom : '/' + nom);
  }

  handleImageError(event: any): void { event.target.src = 'assets/img/team/amadou.jpg'; }
}
