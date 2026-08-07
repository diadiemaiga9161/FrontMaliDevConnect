import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RdvService } from 'src/app/services/rendezVous/rendezVous.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UserService } from 'src/app/services/user/user.service';
import { TypeProjetService } from 'src/app/services/typeProjet/type-projet.service';
import { environment } from 'src/environments/environment';
import { ProjetService } from 'src/app/services/projet/projet.service';
import { ExperienceService } from 'src/app/services/experience/experience.service';
import { ContactService } from 'src/app/services/contact/contact.service';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-profil-professionnel',
  templateUrl: './profil-professionnel.component.html',
  styleUrls: ['./profil-professionnel.component.scss']
})
export class ProfilProfessionnelComponent implements OnInit {

  selectedTab = 'profil';
  User: any;
  form: any;

  // Biographie
  biographieData: any = null;
  biographieTexte = '';
  editingBio = false;

  // Stats
  nombreprojet = 0;
  nombreexperience = 0;

  // Expériences
  experienceProfessionnelle: any[] = [];
  formExperience: any = { titre: null, poste: null, entreprise: null, description: null, datedebut: null, datefin: null, lieux: null };
  experienceEnEdition: any = null;

  // Projets
  projet: any[] = [];
  typesProjet: any[] = [];
  nouveauProjet: any = { titre: '', description: '', typeProjetId: '', photo: null, photosSuppl: null };
  projetModification: any = { id: null, titre: '', description: '', typeProjetId: '', lienProjet: '', photo: null };
  showFormProjet = false;

  // Compétences
  mesConnaissances: any[] = [];
  toutesConnaissances: any[] = [];
  selectedConnaissanceId: number | null = null;
  rechercheComp = '';
  showCompDropdown = false;

  // Contacts
  mesContacts: any[] = [];
  demandesRecues: any[] = [];
  demandesEnvoyees: any[] = [];
  loadingContacts = false;

  // Spécialités supplémentaires
  specialitesPrincipale: any = null;
  specialitesSupp: any[] = [];
  selectedSpecialiteSuppId: number | null = null;

  // Favoris
  mesFavoris: any[] = [];
  loadingFavoris = false;

  // Sécurité
  ChangeMdpForm: any = { oldPassword: null, newPassword: null, password2: null };
  type = true; type1 = true; type2 = true;

  isSuccessful = false;
  isSignUpFailed = false;

  constructor(
    private serviceUser: UserService,
    private storageService: StorageService,
    private authService: AuthService,
    private rdvService: RdvService,
    private specialiteService: SpecialiteService,
    private projetService: ProjetService,
    private typeProjetService: TypeProjetService,
    private experienceService: ExperienceService,
    private contactService: ContactService,
    private favorisService: FavorisService,
    private connaissanceService: ConnaissanceService,
    private router: Router,
  ) {
    this.User = this.storageService.getUser();
    this.form = {
      nom: this.User?.nom,
      prenom: this.User?.prenom,
      telephone: this.User?.telephone,
      email: this.User?.email,
      genre: this.User?.genre,
      adresse: this.User?.adresse,
      specialite: this.User?.specialite?.id || '',
    };
  }

  specialites: any[] = [];

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadSpecialites();
    this.loadBiographie();
    this.loadProjets();
    this.loadExperiences();
    this.loadContacts();
    this.loadFavoris();
    this.loadMesConnaissances();
    this.loadToutesConnaissances();
    this.loadTypesProjet();
    this.loadMesSpecialites();
    this.verifierRdvNonNotifies();
  }

  // ═══ SPÉCIALITÉS ═══
  loadSpecialites(): void {
    this.specialiteService.AfficherListeSPecialite().subscribe({
      next: (data) => { this.specialites = Array.isArray(data) ? data : []; },
      error: () => {}
    });
  }

  loadMesSpecialites(): void {
    this.serviceUser.getMesSpecialites().subscribe({
      next: (data) => {
        this.specialitesPrincipale = data?.principale || null;
        this.specialitesSupp = data?.supplementaires ? Array.from(data.supplementaires) : [];
      },
      error: () => {}
    });
  }

  get specialitesSuppDisponibles(): any[] {
    const liees = this.specialitesSupp.map((s: any) => s.id);
    const principaleId = this.User?.specialite?.id;
    return this.specialites.filter((s: any) => !liees.includes(s.id) && s.id !== principaleId);
  }

  ajouterSpecialiteSupp(): void {
    if (!this.selectedSpecialiteSuppId) return;
    this.serviceUser.ajouterSpecialiteSupp(this.selectedSpecialiteSuppId).subscribe({
      next: (data) => {
        this.specialitesSupp = data?.supplementaires ? Array.from(data.supplementaires) : [];
        this.selectedSpecialiteSuppId = null;
        Swal.fire({ title: 'Spécialité ajoutée', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false });
      },
      error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  retirerSpecialiteSupp(specialiteId: number): void {
    this.serviceUser.retirerSpecialiteSupp(specialiteId).subscribe({
      next: (data) => {
        this.specialitesSupp = data?.supplementaires ? Array.from(data.supplementaires) : [];
      },
      error: () => {}
    });
  }

  // ═══ BIOGRAPHIE ═══
  loadBiographie(): void {
    this.serviceUser.getBiographieParUser(this.User.id).subscribe({
      next: (data) => {
        this.biographieData = Array.isArray(data) ? data[0] : data;
        this.biographieTexte = this.biographieData?.biographie || '';
      },
      error: () => {}
    });
  }

  sauvegarderBiographie(): void {
    if (this.biographieData?.id) {
      this.serviceUser.modifierBiographie(this.biographieData.id, this.biographieTexte).subscribe({
        next: () => {
          this.biographieData.biographie = this.biographieTexte;
          this.editingBio = false;
          Swal.fire({ title: 'Biographie mise à jour', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        },
        error: () => Swal.fire({ title: 'Erreur', icon: 'error', heightAuto: false })
      });
    } else {
      this.serviceUser.ajouterBiographie(this.biographieTexte).subscribe({
        next: (data) => {
          this.biographieData = data;
          this.editingBio = false;
          Swal.fire({ title: 'Biographie ajoutée', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        },
        error: () => Swal.fire({ title: 'Erreur', icon: 'error', heightAuto: false })
      });
    }
  }

  // ═══ TYPES DE PROJET ═══
  loadTypesProjet(): void {
    this.typeProjetService.AfficherListeTypeProjet().subscribe({
      next: (data) => { this.typesProjet = Array.isArray(data) ? data : []; },
      error: () => {}
    });
  }

  // ═══ PROJETS ═══
  loadProjets(): void {
    this.serviceUser.voirMesProjets().subscribe({
      next: (data) => {
        this.projet = Array.isArray(data) ? data : [];
        this.nombreprojet = this.projet.length;
      },
      error: () => { this.projet = []; this.nombreprojet = 0; }
    });
  }

  onProjetPhotoChange(event: any): void {
    const f = event.target.files[0];
    if (f && f.size <= 5 * 1024 * 1024) this.nouveauProjet.photo = f;
    else { Swal.fire({ title: 'Fichier trop lourd (max 5 Mo)', icon: 'warning', heightAuto: false }); event.target.value = ''; }
  }

  onPhotosSupplChange(event: any): void {
    this.nouveauProjet.photosSuppl = event.target.files;
  }

  ajouterProjet(): void {
    if (!this.nouveauProjet.titre || !this.nouveauProjet.description || !this.nouveauProjet.typeProjetId) {
      Swal.fire({ title: 'Remplissez tous les champs obligatoires', icon: 'warning', heightAuto: false });
      return;
    }
    const formData = new FormData();
    formData.append('titre', this.nouveauProjet.titre);
    formData.append('description', this.nouveauProjet.description);
    formData.append('typeProjet', this.nouveauProjet.typeProjetId);
    if (this.nouveauProjet.lienProjet) formData.append('lienProjet', this.nouveauProjet.lienProjet);
    // photo principale en premier (devient la couverture côté backend)
    if (this.nouveauProjet.photo) formData.append('photos', this.nouveauProjet.photo);
    // photos supplémentaires dans le même appel
    if (this.nouveauProjet.photosSuppl) {
      Array.from(this.nouveauProjet.photosSuppl as FileList).forEach((f: File) => formData.append('photos', f));
    }

    this.projetService.AjouterProjet(formData).subscribe({
      next: () => {
        Swal.fire({ title: 'Projet ajouté !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        this.showFormProjet = false;
        this.nouveauProjet = { titre: '', description: '', typeProjetId: '', photo: null, photosSuppl: null };
        this.loadProjets();
      },
      error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  commencerModifierProjet(p: any): void {
    this.projetModification = {
      id: p.id,
      titre: p.titre,
      description: p.description,
      typeProjetId: p.typeProjet?.id || p.typeProjetId || '',
      lienProjet: p.lienProjet || '',
      photo: null
    };
    this.showFormProjet = false;
  }

  annulerModifProjet(): void {
    this.projetModification = { id: null, titre: '', description: '', typeProjetId: '', lienProjet: '', photo: null };
  }

  onProjetModifPhotoChange(event: any): void {
    const f = event.target.files[0];
    if (f && f.size <= 5 * 1024 * 1024) this.projetModification.photo = f;
    else { Swal.fire({ title: 'Fichier trop lourd (max 5 Mo)', icon: 'warning', heightAuto: false }); event.target.value = ''; }
  }

  modifierProjetExistant(): void {
    if (!this.projetModification.titre || !this.projetModification.description || !this.projetModification.typeProjetId) {
      Swal.fire({ title: 'Titre, description et type sont requis', icon: 'warning', heightAuto: false });
      return;
    }
    const formData = new FormData();
    formData.append('titre', this.projetModification.titre);
    formData.append('description', this.projetModification.description);
    formData.append('typeProjet', this.projetModification.typeProjetId);
    if (this.projetModification.lienProjet) formData.append('lienProjet', this.projetModification.lienProjet);
    if (this.projetModification.photo) formData.append('photo', this.projetModification.photo);

    this.projetService.modifierProjetWithFormData(this.projetModification.id, formData).subscribe({
      next: () => {
        Swal.fire({ title: 'Projet modifié !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        this.annulerModifProjet();
        this.loadProjets();
      },
      error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  supprimerProjet(id: number): void {
    Swal.fire({
      title: 'Supprimer ce projet ?', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Oui', cancelButtonText: 'Non',
      confirmButtonColor: '#ef4444', heightAuto: false
    }).then((r) => {
      if (r.isConfirmed) {
        this.projetService.supprimerProjet(id).subscribe({
          next: () => { this.loadProjets(); },
          error: () => {}
        });
      }
    });
  }

  supprimerPhotoProjet(photoId: number): void {
    this.serviceUser.supprimerPhotoProjet(photoId).subscribe({
      next: () => this.loadProjets(),
      error: () => {}
    });
  }

  // ═══ EXPÉRIENCES ═══
  loadExperiences(): void {
    this.experienceService.VoirexperienceProfessionnelle().subscribe({
      next: (data) => {
        this.experienceProfessionnelle = Array.isArray(data) ? data : [];
        this.nombreexperience = this.experienceProfessionnelle.length;
      },
      error: () => { this.experienceProfessionnelle = []; }
    });
  }

  ajouterExperience(): void {
    const { titre, poste, entreprise, description, datedebut, datefin, lieux } = this.formExperience;
    if (!titre || !poste || !entreprise || !datedebut || !lieux) {
      Swal.fire({ title: 'Titre, poste, entreprise, date de début et lieu sont requis', icon: 'warning', heightAuto: false });
      return;
    }
    this.experienceService.Ajouterexperience(titre, poste, entreprise, description, datedebut, datefin, lieux, this.User.id).subscribe({
      next: () => {
        this.formExperience = { titre: null, poste: null, entreprise: null, description: null, datedebut: null, datefin: null, lieux: null };
        this.loadExperiences();
        Swal.fire({ title: 'Expérience ajoutée', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false });
      },
      error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  commencerModifierExperience(exp: any): void {
    this.experienceEnEdition = {
      id: exp.id,
      titre: exp.titre,
      poste: exp.poste,
      entreprise: exp.entreprise,
      description: exp.description,
      datedebut: exp.datedebut,
      datefin: exp.datefin,
      lieux: exp.lieux
    };
  }

  annulerModifExperience(): void {
    this.experienceEnEdition = null;
  }

  sauvegarderModifExperience(): void {
    const { id, titre, poste, entreprise, datedebut, lieux } = this.experienceEnEdition;
    if (!titre || !poste || !entreprise || !datedebut || !lieux) {
      Swal.fire({ title: 'Titre, poste, entreprise, date de début et lieu sont requis', icon: 'warning', heightAuto: false });
      return;
    }
    this.experienceService.modifierExperience(this.experienceEnEdition).subscribe({
      next: () => {
        this.experienceEnEdition = null;
        this.loadExperiences();
        Swal.fire({ title: 'Expérience modifiée', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false });
      },
      error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  supprimerExperience(id: number): void {
    Swal.fire({
      title: 'Supprimer cette expérience ?', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Oui', cancelButtonText: 'Non',
      confirmButtonColor: '#ef4444', heightAuto: false
    }).then((r) => {
      if (r.isConfirmed) {
        this.experienceService.supprimerExperience(id).subscribe({
          next: () => this.loadExperiences(),
          error: () => {}
        });
      }
    });
  }

  // ═══ COMPÉTENCES ═══
  loadMesConnaissances(): void {
    this.connaissanceService.getMesConnaissances().subscribe({
      next: (data) => { this.mesConnaissances = Array.isArray(data) ? data : []; },
      error: () => {}
    });
  }

  loadToutesConnaissances(): void {
    this.connaissanceService.getToutesConnaissances().subscribe({
      next: (data) => { this.toutesConnaissances = Array.isArray(data) ? data : []; },
      error: () => {}
    });
  }

  get connaissancesDisponibles(): any[] {
    const liees = this.mesConnaissances.map((c: any) => c.id);
    return this.toutesConnaissances.filter((c: any) => !liees.includes(c.id));
  }

  get connaissancesFiltrees(): any[] {
    if (!this.rechercheComp.trim()) return this.connaissancesDisponibles.slice(0, 8);
    const q = this.rechercheComp.toLowerCase();
    return this.connaissancesDisponibles.filter(c => c.nom?.toLowerCase().includes(q)).slice(0, 10);
  }

  selectionnerCompetence(competence: any): void {
    this.connaissanceService.lierConnaissance(competence.id).subscribe({
      next: () => {
        this.rechercheComp = '';
        this.showCompDropdown = false;
        this.loadMesConnaissances();
      },
      error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  ajouterCompetence(): void {
    if (!this.selectedConnaissanceId) return;
    this.connaissanceService.lierConnaissance(this.selectedConnaissanceId).subscribe({
      next: () => { this.selectedConnaissanceId = null; this.loadMesConnaissances(); },
      error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  supprimerCompetence(id: number): void {
    this.connaissanceService.retirerConnaissance(id).subscribe({
      next: () => this.loadMesConnaissances(),
      error: () => {}
    });
  }

  // ═══ CONTACTS ═══
  loadContacts(): void {
    this.loadingContacts = true;
    this.contactService.getMesContacts().subscribe({
      next: (data) => { this.mesContacts = Array.isArray(data) ? data : []; this.loadingContacts = false; },
      error: () => { this.mesContacts = []; this.loadingContacts = false; }
    });
    this.contactService.getDemandesRecues().subscribe({
      next: (data) => { this.demandesRecues = Array.isArray(data) ? data : []; },
      error: () => { this.demandesRecues = []; }
    });
    this.contactService.getDemandesEnvoyees().subscribe({
      next: (data) => { this.demandesEnvoyees = Array.isArray(data) ? data : []; },
      error: () => { this.demandesEnvoyees = []; }
    });
  }

  accepterDemande(id: number): void {
    this.contactService.accepterDemande(id).subscribe({
      next: () => {
        Swal.fire({ title: 'Contact accepté !', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false });
        this.loadContacts();
      },
      error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  refuserDemande(id: number): void {
    this.contactService.refuserDemande(id).subscribe({
      next: () => {
        Swal.fire({ title: 'Demande refusée', icon: 'info', timer: 1200, showConfirmButton: false, heightAuto: false });
        this.loadContacts();
      },
      error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  voirProfilContact(token: string): void {
    if (token) this.router.navigate(['/professionnel', token]);
  }

  extractAutreUser(contact: any): any {
    if (contact?.contact) return contact.contact;
    const myId = this.User?.id;
    return contact?.expediteur?.id === myId ? contact?.recepteur : contact?.expediteur;
  }

  // ═══ FAVORIS ═══
  loadFavoris(): void {
    this.loadingFavoris = true;
    this.favorisService.getMesFavoris().subscribe({
      next: (data) => { this.mesFavoris = Array.isArray(data) ? data : []; this.loadingFavoris = false; },
      error: () => { this.mesFavoris = []; this.loadingFavoris = false; }
    });
  }

  retirerFavori(idUser: number): void {
    this.favorisService.retirerFavori(idUser).subscribe({
      next: () => this.loadFavoris(),
      error: () => {}
    });
  }

  // ═══ PROFIL / PHOTO ═══

  rechargerUtilisateur(): void {
    this.serviceUser.AfficherInfoUserConnecte().subscribe({
      next: (data) => {
        const stored = this.storageService.getUser();
        const updated = { ...stored, ...data };
        this.storageService.setUser(updated);
        this.User = updated;
        this.form = {
          nom: updated.nom,
          prenom: updated.prenom,
          telephone: updated.telephone,
          email: updated.email,
          genre: updated.genre,
          adresse: updated.adresse,
          specialite: updated.specialite?.id || '',
        };
      },
      error: () => {}
    });
  }

  onPhotoChange(event: any): void {
    const f = event.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      Swal.fire({ title: 'Fichier trop lourd (max 5 Mo)', icon: 'warning', heightAuto: false });
      event.target.value = '';
      return;
    }
    this.serviceUser.changerPhoto(f).subscribe({
      next: () => {
        Swal.fire({ title: 'Photo mise à jour', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        this.rechargerUtilisateur();
      },
      error: () => Swal.fire({ title: 'Erreur lors du changement de photo', icon: 'error', heightAuto: false })
    });
  }

  ModifierProfilUser(): void {
    const { nom, prenom, telephone, email, genre, adresse } = this.form;
    Swal.fire({
      text: 'Confirmer la modification du profil ?', icon: 'question',
      showCancelButton: true, confirmButtonText: 'Oui', cancelButtonText: 'Non',
      heightAuto: false
    }).then((r) => {
      if (r.isConfirmed) {
        this.serviceUser.modifierProfilUser(nom, prenom, telephone, adresse, genre, email).subscribe({
          next: () => {
            this.rechargerUtilisateur();
            Swal.fire({ title: 'Profil mis à jour !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
          },
          error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
        });
      }
    });
  }

  // ═══ SÉCURITÉ ═══
  changeType() { this.type = !this.type; }
  changeType1() { this.type1 = !this.type1; }
  changeType2() { this.type2 = !this.type2; }

  ModifierMotDePasse(): void {
    const { oldPassword, newPassword, password2 } = this.ChangeMdpForm;
    if (newPassword !== password2) {
      Swal.fire({ text: 'Les mots de passe ne correspondent pas.', icon: 'error', heightAuto: false });
      return;
    }
    Swal.fire({
      text: 'Confirmer le changement de mot de passe ?', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Confirmer', cancelButtonText: 'Annuler',
      heightAuto: false
    }).then((r) => {
      if (r.isConfirmed) {
        this.serviceUser.modifierMotDePasse(oldPassword, newPassword).subscribe({
          next: () => {
            Swal.fire({ title: 'Mot de passe modifié', icon: 'success', timer: 2000, showConfirmButton: false, heightAuto: false })
              .then(() => {
                this.authService.logout().subscribe({ next: () => { this.storageService.clean(); this.router.navigateByUrl('/'); }, error: () => {} });
              });
          },
          error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
        });
      }
    });
  }

  // ═══ RDV (notification non vus) ═══
  verifierRdvNonNotifies(): void {
    this.rdvService.AfficherRdvParRecuParUserConnecters().subscribe({
      next: (data) => {
        if (data?.length > 0) {
          const rdv = data[0];
          Swal.fire({
            title: 'Nouveau rendez-vous !',
            html: `<p>De <strong>${rdv?.userenvoyer?.prenom || ''} ${rdv?.userenvoyer?.nom || ''}</strong></p>
                   <p><strong>Objet :</strong> ${rdv?.objet || '—'}</p>
                   <p><strong>Date :</strong> ${rdv?.dateRendezvous || rdv?.date || '—'}</p>`,
            icon: 'info', showCancelButton: true,
            confirmButtonText: 'Voir les RDV', cancelButtonText: 'Plus tard', heightAuto: false
          }).then((r) => { if (r.isConfirmed) this.router.navigate(['/rdv-details']); });
        }
      },
      error: () => {}
    });
  }

  // ═══ PARTAGE ═══
  partagerProfil(): void {
    this.serviceUser.genererLienPartage().subscribe({
      next: (res) => {
        const token = res?.tokenPartage || res?.lien || res;
        const url = `${window.location.origin}/professionnel/${token}`;
        navigator.clipboard.writeText(url).then(() => {
          Swal.fire({ title: 'Lien copié !', text: url, icon: 'success', confirmButtonText: 'OK', heightAuto: false });
        }).catch(() => {
          Swal.fire({ title: 'Lien de partage', html: `<input class="swal2-input" value="${url}" readonly onclick="this.select()">`, icon: 'info', heightAuto: false });
        });
      },
      error: () => Swal.fire({ title: 'Erreur', text: 'Impossible de générer le lien', icon: 'error', heightAuto: false })
    });
  }

  // ═══ UTILITAIRES ═══
  generateImageUrl(nom: string): string {
    if (!nom) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    return base + (nom.startsWith('/') ? nom : '/' + nom);
  }

  handleAuthorImageError(event: any): void { event.target.src = 'assets/img/team/amadou.jpg'; }

  changeTab(tab: string): void { this.selectedTab = tab; }
  isTabActive(tab: string): boolean { return this.selectedTab === tab; }
}
