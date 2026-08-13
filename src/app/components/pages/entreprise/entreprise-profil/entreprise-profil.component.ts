import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { EntrepriseService } from 'src/app/services/entreprise/entreprise.service';
import { OffreEmploiService } from 'src/app/services/offre-emploi/offre-emploi.service';
import { environment } from 'src/environments/environment';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-entreprise-profil',
  templateUrl: './entreprise-profil.component.html',
  styleUrls: ['./entreprise-profil.component.scss']
})
export class EntrepriseProfilComponent implements OnInit {
  token: string = '';
  user: any = null;
  entreprise: any = null;
  offres: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private entrepriseService: EntrepriseService,
    private offreService: OffreEmploiService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
    this.userService.getProfilPublic(this.token).subscribe({
      next: (data) => {
        if (!data) { this.loading = false; return; }
        this.user = data;
        this.entrepriseService.parUser(data.id).subscribe({
          next: (ent) => { this.entreprise = ent; this.loading = false; },
          error: () => { this.loading = false; }
        });
        this.offreService.parEntreprise(data.id).subscribe({
          next: (o) => this.offres = (o || []).filter((x: any) => x.statut !== false),
          error: () => {}
        });
      },
      error: () => { this.loading = false; }
    });
  }

  generateImageUrl(chemin: string | null | undefined): string {
    if (!chemin) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    return base + (chemin.startsWith('/') ? chemin : '/' + chemin);
  }

  handleImageError(event: any): void { event.target.src = 'assets/img/team/amadou.jpg'; }

  voirOffre(offre: any): void {
    this.router.navigate(['/offres', offre?.tokenPartage || offre?.id]);
  }
}
