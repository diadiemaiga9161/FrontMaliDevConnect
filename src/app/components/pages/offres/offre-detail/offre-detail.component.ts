import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreEmploiService } from 'src/app/services/offre-emploi/offre-emploi.service';
import { CandidatureService } from 'src/app/services/candidature/candidature.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-offre-detail',
  templateUrl: './offre-detail.component.html',
  styleUrls: ['./offre-detail.component.scss']
})
export class OffreDetailComponent implements OnInit {
  offre: any = null;
  loading = true;
  isLoggedIn = false;
  currentUser: any = null;
  messageCandidature = '';
  envoiEnCours = false;
  dejaPostule = false;
  photoActive: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreEmploiService,
    private candidatureService: CandidatureService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.isLoggedIn = !!(this.currentUser && this.currentUser.token);

    const token = this.route.snapshot.params['id'];
    this.offreService.parToken(token).subscribe({
      next: (data) => {
        if (data) { this.appliquerOffre(data); }
        else { this.chargerParId(token); }
      },
      error: () => { this.chargerParId(token); }
    });
  }

  private chargerParId(token: string): void {
    const id = Number(token);
    if (!id || isNaN(id)) { this.loading = false; return; }
    this.offreService.parId(id).subscribe({
      next: (data) => { if (data) this.appliquerOffre(data); else this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  private appliquerOffre(data: any): void {
    this.offre = data;
    this.photoActive = data?.photo || data?.photos?.[0]?.chemin || null;
    this.loading = false;
    if (this.isLoggedIn && data?.id) this.verifierCandidature(data.id);
  }

  verifierCandidature(offreId: number): void {
    this.candidatureService.mesCandidatures().subscribe({
      next: (list) => {
        this.dejaPostule = (list || []).some((c: any) => c.offre?.id === offreId);
      },
      error: () => {}
    });
  }

  get estExpiree(): boolean {
    if (!this.offre?.dateLimite) return false;
    const limite = new Date(this.offre.dateLimite);
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    return limite < aujourdhui;
  }

  postuler(): void {
    if (this.estExpiree) {
      Swal.fire({ title: 'Offre expirée', text: 'Cette offre a dépassé sa date limite de candidature.', icon: 'warning', heightAuto: false });
      return;
    }
    if (!this.isLoggedIn) {
      Swal.fire({ title: 'Connexion requise', text: 'Connectez-vous pour postuler à cette offre.', icon: 'info', heightAuto: false });
      this.router.navigate(['/connexion']);
      return;
    }
    this.envoiEnCours = true;
    this.candidatureService.postuler(this.offre.id, this.messageCandidature).subscribe({
      next: () => {
        this.envoiEnCours = false;
        this.dejaPostule = true;
        Swal.fire({ title: 'Candidature envoyée !', icon: 'success', heightAuto: false });
      },
      error: (err) => {
        this.envoiEnCours = false;
        Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible d\'envoyer la candidature', icon: 'error', heightAuto: false });
      }
    });
  }

  setPhotoActive(chemin: string): void {
    this.photoActive = chemin;
  }

  voirEntreprise(): void {
    const token = this.offre?.entreprise?.tokenPartage;
    if (token) this.router.navigate(['/entreprise', token]);
  }

  generateImageUrl(nom: string | null | undefined): string {
    if (!nom) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    return base + (nom.startsWith('/') ? nom : '/' + nom);
  }

  handleImageError(event: any): void { event.target.src = 'assets/img/team/amadou.jpg'; }
}
