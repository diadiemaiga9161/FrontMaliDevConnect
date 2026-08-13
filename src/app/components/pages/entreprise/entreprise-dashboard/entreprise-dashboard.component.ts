import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from 'src/app/services/entreprise/entreprise.service';
import { OffreEmploiService, OffreEmploiPayload } from 'src/app/services/offre-emploi/offre-emploi.service';
import { CandidatureService } from 'src/app/services/candidature/candidature.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ChatModalService } from 'src/app/services/chat-modal/chat-modal.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-entreprise-dashboard',
  templateUrl: './entreprise-dashboard.component.html',
  styleUrls: ['./entreprise-dashboard.component.scss']
})
export class EntrepriseDashboardComponent implements OnInit {

  ongletActif: 'profil' | 'offres' | 'candidatures' = 'profil';
  loading = true;

  // ── Profil entreprise ──
  profil: any = null;
  formProfil: any = { nomEntreprise: '', secteurActivite: '', description: '', siteWeb: '' };
  logoFile: File | null = null;
  enregistrementProfil = false;

  // ── Offres ──
  offres: any[] = [];
  specialites: any[] = [];
  connaissances: any[] = [];
  formOffre: OffreEmploiPayload = { titre: '', description: '', typeContrat: 'CDI', lieu: '', dateLimite: '', specialiteId: null, connaissanceIds: [] };
  photosOffre: FileList | null = null;
  afficherFormOffre = false;
  enregistrementOffre = false;

  // ── Candidatures / recommandations pour une offre sélectionnée ──
  offreSelectionnee: any = null;
  candidatures: any[] = [];
  profilsRecommandes: any[] = [];
  sousOnglet: 'candidatures' | 'recommandes' = 'candidatures';

  constructor(
    private entrepriseService: EntrepriseService,
    private offreService: OffreEmploiService,
    private candidatureService: CandidatureService,
    private specialiteService: SpecialiteService,
    private connaissanceService: ConnaissanceService,
    private storageService: StorageService,
    private chatModalService: ChatModalService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.chargerProfil();
    this.chargerOffres();
    this.specialiteService.AfficherListeSPecialite().subscribe({ next: (d) => this.specialites = d || [], error: () => {} });
    this.connaissanceService.AfficherListeConnaissance().subscribe({ next: (d) => this.connaissances = d || [], error: () => {} });
  }

  chargerProfil(): void {
    this.loading = true;
    this.entrepriseService.monProfil().subscribe({
      next: (data) => {
        this.profil = data;
        if (data) {
          this.formProfil = {
            nomEntreprise: data.nomEntreprise || '',
            secteurActivite: data.secteurActivite || '',
            description: data.description || '',
            siteWeb: data.siteWeb || ''
          };
        } else {
          this.ongletActif = 'profil';
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onLogoChange(event: any): void {
    this.logoFile = event.target.files[0] || null;
  }

  enregistrerProfil(): void {
    if (!this.formProfil.nomEntreprise?.trim()) {
      Swal.fire({ title: 'Erreur', text: 'Le nom de l\'entreprise est obligatoire.', icon: 'error', heightAuto: false });
      return;
    }
    this.enregistrementProfil = true;
    const data = new FormData();
    data.append('nomEntreprise', this.formProfil.nomEntreprise);
    data.append('secteurActivite', this.formProfil.secteurActivite || '');
    data.append('description', this.formProfil.description || '');
    data.append('siteWeb', this.formProfil.siteWeb || '');
    if (this.logoFile) data.append('logo', this.logoFile);

    this.entrepriseService.ajouterOuModifier(data).subscribe({
      next: () => {
        this.enregistrementProfil = false;
        Swal.fire({ title: 'Profil enregistré', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        this.chargerProfil();
        this.rechargerUtilisateur();
        this.ongletActif = 'offres';
      },
      error: (err) => {
        this.enregistrementProfil = false;
        Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible d\'enregistrer', icon: 'error', heightAuto: false });
      }
    });
  }

  // Rafraîchit l'utilisateur en cache (localStorage) après un changement de logo,
  // pour que le nav (et le reste de l'appli) affiche la nouvelle photo sans avoir
  // à se reconnecter — le logo est synchronisé côté backend sur utilisateurPhoto.
  rechargerUtilisateur(): void {
    this.userService.AfficherInfoUserConnecte().subscribe({
      next: (data) => {
        const stored = this.storageService.getUser();
        this.storageService.setUser({ ...stored, ...data });
      },
      error: () => {}
    });
  }

  // ── Offres ──
  chargerOffres(): void {
    this.offreService.mesOffres().subscribe({ next: (d) => this.offres = d || [], error: () => {} });
  }

  offreEnEdition: any = null;

  toggleFormOffre(): void {
    this.afficherFormOffre = !this.afficherFormOffre;
    if (this.afficherFormOffre) {
      this.offreEnEdition = null;
      this.formOffre = { titre: '', description: '', typeContrat: 'CDI', lieu: '', dateLimite: '', specialiteId: null, connaissanceIds: [] };
      this.photosOffre = null;
    }
  }

  modifierOffreClick(offre: any): void {
    this.offreEnEdition = offre;
    this.formOffre = {
      titre: offre.titre || '',
      description: offre.description || '',
      typeContrat: offre.typeContrat || 'CDI',
      lieu: offre.lieu || '',
      dateLimite: offre.dateLimite || '',
      specialiteId: offre.specialite?.id ?? null,
      connaissanceIds: (offre.connaissancesRequises || []).map((c: any) => c.id)
    };
    this.photosOffre = null;
    this.afficherFormOffre = true;
  }

  onPhotosOffreChange(event: any): void {
    this.photosOffre = event.target.files;
  }

  ajoutEnCours = false;

  ajouterPhotosOffre(event: any): void {
    const files: FileList = event.target.files;
    if (!files?.length || !this.offreEnEdition) return;
    this.ajoutEnCours = true;
    this.offreService.ajouterPhotos(this.offreEnEdition.id, files).subscribe({
      next: () => {
        event.target.value = '';
        this.offreService.parId(this.offreEnEdition.id).subscribe({
          next: (data: any) => {
            this.ajoutEnCours = false;
            this.offreEnEdition.photos = data?.photos || [];
            this.chargerOffres();
          },
          error: () => { this.ajoutEnCours = false; }
        });
      },
      error: () => {
        this.ajoutEnCours = false;
        Swal.fire({ title: 'Erreur', text: 'Impossible d\'ajouter les photos', icon: 'error', heightAuto: false });
      }
    });
  }

  supprimerPhotoOffre(photo: any): void {
    if (!this.offreEnEdition) return;
    this.offreService.supprimerPhoto(photo.id).subscribe({
      next: () => {
        this.offreEnEdition.photos = (this.offreEnEdition.photos || []).filter((p: any) => p.id !== photo.id);
        this.chargerOffres();
      },
      error: () => Swal.fire({ title: 'Erreur', text: 'Impossible de supprimer la photo', icon: 'error', heightAuto: false })
    });
  }

  toggleConnaissance(id: number): void {
    const idx = (this.formOffre.connaissanceIds || []).indexOf(id);
    if (idx >= 0) this.formOffre.connaissanceIds!.splice(idx, 1);
    else (this.formOffre.connaissanceIds = this.formOffre.connaissanceIds || []).push(id);
  }

  isConnaissanceSelectionnee(id: number): boolean {
    return (this.formOffre.connaissanceIds || []).includes(id);
  }

  publierOffre(): void {
    if (!this.formOffre.titre?.trim()) {
      Swal.fire({ title: 'Erreur', text: 'Le titre de l\'offre est obligatoire.', icon: 'error', heightAuto: false });
      return;
    }
    this.enregistrementOffre = true;

    const operation = this.offreEnEdition
      ? this.offreService.modifier(this.offreEnEdition.id, this.formOffre)
      : this.offreService.ajouter(this.formOffre, this.photosOffre);

    operation.subscribe({
      next: () => {
        this.enregistrementOffre = false;
        this.afficherFormOffre = false;
        const modification = !!this.offreEnEdition;
        this.offreEnEdition = null;
        Swal.fire({ title: modification ? 'Offre modifiée !' : 'Offre publiée !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        this.chargerOffres();
      },
      error: (err) => {
        this.enregistrementOffre = false;
        Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible d\'enregistrer l\'offre', icon: 'error', heightAuto: false });
      }
    });
  }

  supprimerOffre(offre: any): void {
    Swal.fire({
      title: 'Supprimer cette offre ?', icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Oui, supprimer', cancelButtonText: 'Annuler', confirmButtonColor: '#ef4444', heightAuto: false
    }).then((r) => {
      if (!r.isConfirmed) return;
      this.offreService.supprimer(offre.id).subscribe({
        next: () => {
          this.chargerOffres();
          if (this.offreSelectionnee?.id === offre.id) this.offreSelectionnee = null;
        },
        error: () => Swal.fire({ title: 'Erreur', icon: 'error', heightAuto: false })
      });
    });
  }

  selectionnerOffre(offre: any): void {
    this.offreSelectionnee = offre;
    this.ongletActif = 'candidatures';
    this.sousOnglet = 'candidatures';
    this.chargerCandidatures();
    this.chargerRecommandations();
  }

  chargerCandidatures(): void {
    if (!this.offreSelectionnee) return;
    this.candidatureService.candidaturesPourOffre(this.offreSelectionnee.id).subscribe({
      next: (d) => this.candidatures = Array.isArray(d) ? d : [],
      error: () => { this.candidatures = []; }
    });
  }

  chargerRecommandations(): void {
    if (!this.offreSelectionnee) return;
    this.offreService.profilsRecommandes(this.offreSelectionnee.id).subscribe({
      next: (d) => this.profilsRecommandes = d || [],
      error: () => { this.profilsRecommandes = []; }
    });
  }

  accepterCandidature(c: any): void {
    Swal.fire({
      title: 'Accepter cette candidature',
      input: 'textarea',
      inputLabel: 'Motif (visible par le candidat)',
      inputPlaceholder: 'Ex : Votre profil correspond parfaitement, nous vous contacterons pour la suite...',
      showCancelButton: true,
      confirmButtonText: 'Accepter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#10b981',
      heightAuto: false,
      inputValidator: (value) => !value?.trim() ? 'Le motif est obligatoire.' : null
    }).then((r) => {
      if (!r.isConfirmed) return;
      this.candidatureService.accepter(c.id, r.value.trim()).subscribe({
        next: () => { c.statut = 'ACCEPTEE'; c.motifReponse = r.value.trim(); },
        error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
      });
    });
  }

  refuserCandidature(c: any): void {
    Swal.fire({
      title: 'Refuser cette candidature',
      input: 'textarea',
      inputLabel: 'Motif (visible par le candidat)',
      inputPlaceholder: 'Ex : Nous recherchons davantage d\'expérience sur...',
      showCancelButton: true,
      confirmButtonText: 'Refuser',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444',
      heightAuto: false,
      inputValidator: (value) => !value?.trim() ? 'Le motif est obligatoire.' : null
    }).then((r) => {
      if (!r.isConfirmed) return;
      this.candidatureService.refuser(c.id, r.value.trim()).subscribe({
        next: () => { c.statut = 'REFUSEE'; c.motifReponse = r.value.trim(); },
        error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
      });
    });
  }

  // Ouvre le chat pour contacter directement un professionnel (candidat ou profil recommandé)
  contacter(personne: any): void {
    const cible = personne?.tokenPartage || (personne?.id != null ? String(personne.id) : null);
    if (!cible) return;
    this.chatModalService.open(cible);
  }

  get offresActives(): number {
    return this.offres.filter((o) => !this.estExpiree(o)).length;
  }

  estExpiree(offre: any): boolean {
    if (!offre?.dateLimite) return false;
    const limite = new Date(offre.dateLimite);
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    return limite < aujourdhui;
  }

  generateImageUrl(nom: string | null): string {
    if (!nom) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    return base + (nom.startsWith('/') ? nom : '/' + nom);
  }

  handleImageError(event: any): void { event.target.src = 'assets/img/team/amadou.jpg'; }
}
