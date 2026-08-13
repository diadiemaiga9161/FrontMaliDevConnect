import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CandidatureService } from 'src/app/services/candidature/candidature.service';
import { environment } from 'src/environments/environment';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-mes-candidatures',
  templateUrl: './mes-candidatures.component.html',
  styleUrls: ['./mes-candidatures.component.scss']
})
export class MesCandidaturesComponent implements OnInit {
  candidatures: any[] = [];
  loading = true;
  filtreStatut: 'toutes' | 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE' = 'toutes';

  constructor(
    private candidatureService: CandidatureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.candidatureService.mesCandidatures().subscribe({
      next: (data) => { this.candidatures = data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get candidaturesFiltrees(): any[] {
    if (this.filtreStatut === 'toutes') return this.candidatures;
    return this.candidatures.filter(c => c.statut === this.filtreStatut);
  }

  compte(statut: string): number {
    return this.candidatures.filter(c => c.statut === statut).length;
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
