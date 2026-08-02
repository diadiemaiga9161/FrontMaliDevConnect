import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { RdvService } from 'src/app/services/rendezVous/rendezVous.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TyperdvService } from 'src/app/services/typerdv/typerdv.service';
import { ExperienceService } from 'src/app/services/experience/experience.service';
import Swal from 'sweetalert2';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { CommentaireService } from 'src/app/services/commentaire/commentaire.service';
import { ProjetService } from 'src/app/services/projet/projet.service';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { ContactService } from 'src/app/services/contact/contact.service';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-profil-dev',
  templateUrl: './profil-dev.component.html',
  styleUrls: ['./profil-dev.component.scss']
})
export class ProfilDevComponent implements OnInit {

  selectedTab: string = 'profil';
  token: string = '';
  id: any;
  professionnel: any;
  specialite: any;
  specialitesSupp: any[] = [];
  projet: any;
  experienceProfessionnelle: any;
  non: any;
  typerdv: any;
  typeConnaissances: any;
  connaissances: any;
  biographie: any = null;
  connaissance: any;
  profileImageUrl: string = '';
  User: any;
  errorMessage: any = '';
  isSuccess: any = false;
  isError: any = false;
  isLoggedIn = false;
  isLoginFailed = true;
  type: any;
  commentaire: any;
  
  // ========== FAVORIS ==========
  isFavori: boolean = false;

  // ========== CONTACT / AMITIÉ ==========
  contactStatut: 'none' | 'pending' | 'connected' = 'none';

  // ========== VARIABLES POUR LES COMMENTAIRES ==========
  commentairesRecus: any[] = [];
  commentairesEnvoyes: any[] = [];
  statistiquesCommentaires: any = { recus: 0, envoyes: 0, total: 0 };
  loadingCommentaires: boolean = false;
  afficherCommentairesRecus: boolean = true;
  
  // ========== VARIABLES POUR LES ÉTOILES AVEC DEMI-ÉTOILES ==========
  noteMoyenne: number = 0;
  nombreCommentaires: number = 0;
  etoiles: number[] = [1, 2, 3, 4, 5];

  // ========== FORMULAIRES ==========
  CommentaireForm: any = {
    commentaires: '',
    userRecu: ''
  };

  RdvForm: any = {
    objet: null,
    dateRendezvous: null,
    heureRendezvous: null,
    typeRendezVousId: null,
    userRecu: null
  };

  // ========== GETTERS ==========
  get currentUser(): any {
    return this.storageService.getUser();
  }

  // ========== VÉRIFIER SI C'EST LE PROPRE PROFIL ==========
  get isOwnProfile(): boolean {
    const user = this.storageService.getUser();
    return !!(user && this.professionnel && user.id === this.professionnel.id);
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    if (!photoFileName) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    const path = photoFileName.startsWith('/') ? photoFileName : '/' + photoFileName;
    return base + path;
  }
  
  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/amadou.jpg';
  }

  constructor(
    private route: ActivatedRoute,
    private serviceUser: UserService,
    private experienceService: ExperienceService,
    private commentaireService: CommentaireService,
    private serviceTypeRdv: TyperdvService,
    private connaissanceService: ConnaissanceService,
    private storageService: StorageService,
    private rdvService: RdvService,
    private projetService: ProjetService,
    private favorisService: FavorisService,
    private contactService: ContactService,
    public router: Router,
  ) { }

  form: any = {
    commentaires: null,
    idinf: null
  };

  ngOnInit(): void {
    this.checkUserLoggedIn();

    // Récupérer le token depuis l'URL (plus d'ID visible)
    this.token = this.route.snapshot.params["token"];

    // Types de RDV
    this.serviceTypeRdv.AfficherListeTyperdv().subscribe(data => {
      this.typerdv = data;
    });

    // 1) Charger via token public (ne nécessite pas d'auth, ne révèle pas l'ID)
    this.serviceUser.getProfilPublic(this.token).subscribe({
      next: (data) => {
        if (data) {
          // Token trouvé → charger depuis la réponse publique
          this.professionnel = data;
          this.specialite = data?.specialite;
          this.id = data?.id;

          // Incrémenter le compteur de vues si connecté
          const user = this.storageService.getUser();
          if (user && user.token && this.id) {
            this.serviceUser.voirProfil(this.id).subscribe({ error: () => {} });
          }
          this.chargerDonneesSecondaires();
        } else {
          // Backend retourne null (200 OK) → tokenPartage inexistant → fallback par ID
          this.chargerParId();
        }
      },
      error: () => {
        // Erreur HTTP → fallback par ID
        this.chargerParId();
      }
    });
  }

  chargerParId(): void {
    const idFallback = +this.token;
    if (!isNaN(idFallback) && idFallback > 0) {
      this.id = idFallback;
      this.serviceUser.voirProfil(this.id).subscribe({
        next: (d) => {
          if (d) {
            this.professionnel = d;
            this.specialite = d?.specialite;
            this.chargerDonneesSecondaires();
          }
        },
        error: () => {}
      });
    }
  }

  chargerDonneesSecondaires(): void {
    if (!this.id) return;

    this.serviceUser.getBiographieParUser(this.id).subscribe(bio => { this.biographie = bio; });
    this.projetService.getProjetsByUserId(this.id).subscribe(projets => { this.projet = projets; });
    this.experienceService.getExperiencesParUser(this.id).subscribe(exp => { this.experienceProfessionnelle = exp; });
    this.connaissanceService.getConnaissancesParUser(this.id).subscribe(c => { this.connaissance = c; });
    this.serviceUser.getSpecialitesParUserId(this.id).subscribe({
      next: (data) => { this.specialitesSupp = data?.supplementaires ? Array.from(data.supplementaires) : []; },
      error: () => { this.specialitesSupp = []; }
    });
    this.chargerCommentairesDuProfil();

    const user = this.storageService.getUser();
    if (user && user.token && user.id !== this.id) {
      this.favorisService.verifierFavori(this.id).subscribe({
        next: (res) => { this.isFavori = res === true || res?.favori === true; },
        error: () => { this.isFavori = false; }
      });
      this.verifierStatutContact();
    }
  }

  // ========== CONTACT / AMITIÉ ==========

  verifierStatutContact(): void {
    const user = this.storageService.getUser();
    if (!user || !user.id || !this.id) return;
    this.contactService.verifierContact(user.id, this.id).subscribe({
      next: (res) => {
        if (res?.enContact === true || res?.statut === 'ACCEPTE') {
          this.contactStatut = 'connected';
        } else if (res?.statut === 'EN_ATTENTE' || res?.statut === 'EN_ATTENTE_RECU') {
          this.contactStatut = 'pending';
        } else {
          this.contactStatut = 'none';
        }
      },
      error: () => { this.contactStatut = 'none'; }
    });
  }

  demanderContact(): void {
    if (!this.isLoggedIn) {
      Swal.fire({ title: 'Non connecté', text: 'Connectez-vous pour envoyer une demande de contact.', icon: 'warning', heightAuto: false });
      return;
    }
    this.contactService.envoyerDemande(this.id).subscribe({
      next: () => {
        this.contactStatut = 'pending';
        Swal.fire({ title: 'Demande envoyée !', text: 'Votre demande de contact a été envoyée.', icon: 'success', timer: 2000, showConfirmButton: false, heightAuto: false });
      },
      error: (err) => {
        Swal.fire({ title: 'Erreur', text: err.error?.message || 'Impossible d\'envoyer la demande.', icon: 'error', heightAuto: false });
      }
    });
  }

  // ========== MÉTHODES POUR LES COMMENTAIRES DU PROFIL ==========

  /**
   * Charger UNIQUEMENT les commentaires destinés à CE profil
   */
  chargerCommentairesDuProfil(): void {
    this.loadingCommentaires = true;

    this.commentaireService.getCommentairesDuProfil(this.id).subscribe({
      next: (data) => {
        this.commentairesRecus = Array.isArray(data) ? data : [];
        this.nombreCommentaires = this.commentairesRecus.length;
        this.calculerNoteMoyenne();
        this.loadingCommentaires = false;
      },
      error: (err) => {
        console.error('Erreur chargement commentaires du profil:', err);
        this.commentairesRecus = [];
        this.loadingCommentaires = false;
      }
    });
  }

  /**
   * Charger les commentaires envoyés par l'utilisateur connecté
   */
  chargerCommentairesEnvoyes(): void {
    this.loadingCommentaires = true;
    this.commentaireService.getMesCommentairesEnvoyes().subscribe({
      next: (data) => {
        this.commentairesEnvoyes = Array.isArray(data) ? data : [];
        this.loadingCommentaires = false;
      },
      error: (err) => {
        console.error('Erreur chargement commentaires envoyés:', err);
        this.commentairesEnvoyes = [];
        this.loadingCommentaires = false;
      }
    });
  }

  // ========== MÉTHODES POUR LES ÉTOILES AVEC DEMI-ÉTOILES ==========

  /**
   * Calculer la note moyenne basée sur le nombre de commentaires
   * Règle: 1 étoile = 1-2 com, 2 = 3-4, 3 = 5-6, 4 = 7-8, 5 = 9+
   * Avec gestion des demi-étoiles
   */
  calculerNoteMoyenne(): void {
    if (this.nombreCommentaires === 0) {
      this.noteMoyenne = 0;
    } else if (this.nombreCommentaires === 1) {
      this.noteMoyenne = 1; // 1 étoile pour 1 commentaire
    } else if (this.nombreCommentaires === 2) {
      this.noteMoyenne = 1.5; // 1.5 étoiles pour 2 commentaires
    } else if (this.nombreCommentaires === 3) {
      this.noteMoyenne = 2; // 2 étoiles pour 3 commentaires
    } else if (this.nombreCommentaires === 4) {
      this.noteMoyenne = 2.5; // 2.5 étoiles pour 4 commentaires
    } else if (this.nombreCommentaires === 5) {
      this.noteMoyenne = 3; // 3 étoiles pour 5 commentaires
    } else if (this.nombreCommentaires === 6) {
      this.noteMoyenne = 3.5; // 3.5 étoiles pour 6 commentaires
    } else if (this.nombreCommentaires === 7) {
      this.noteMoyenne = 4; // 4 étoiles pour 7 commentaires
    } else if (this.nombreCommentaires === 8) {
      this.noteMoyenne = 4.5; // 4.5 étoiles pour 8 commentaires
    } else {
      this.noteMoyenne = 5; // 5 étoiles pour 9+ commentaires
    }
  }

  /**
   * Vérifier si l'étoile doit être pleine
   */
  isEtoilePleine(etoile: number): boolean {
    return etoile <= Math.floor(this.noteMoyenne);
  }

  /**
   * Vérifier si l'étoile doit être à moitié
   */
  isEtoileMoitie(etoile: number): boolean {
    const partieEntiere = Math.floor(this.noteMoyenne);
    const partieDecimale = this.noteMoyenne - partieEntiere;
    return etoile === partieEntiere + 1 && partieDecimale >= 0.5;
  }

  /**
   * Obtenir le texte de la note
   */
  getTexteNote(): string {
    if (this.nombreCommentaires === 0) {
      return 'Aucun commentaire';
    } else if (this.nombreCommentaires === 1) {
      return '1 commentaire';
    } else {
      return `${this.nombreCommentaires} commentaires`;
    }
  }

  /**
   * Obtenir le niveau de popularité
   */
  getNiveauPopularite(): string {
    if (this.noteMoyenne <= 1) {
      return 'Débutant';
    } else if (this.noteMoyenne <= 2) {
      return 'Intermédiaire';
    } else if (this.noteMoyenne <= 3) {
      return 'Professionnel';
    } else if (this.noteMoyenne <= 4) {
      return 'Expert';
    } else {
      return 'Top Expert';
    }
  }

  /**
   * Basculer entre l'affichage des commentaires reçus et envoyés
   */
  toggleCommentaires(): void {
    this.afficherCommentairesRecus = !this.afficherCommentairesRecus;
    if (this.afficherCommentairesRecus) {
      this.chargerCommentairesDuProfil();
    } else {
      this.chargerCommentairesEnvoyes();
    }
  }

  /**
   * Formater la date pour l'affichage
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.selectedTab === tab;
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  checkUserLoggedIn(): void {
    const user = this.storageService.getUser();
    this.isLoggedIn = !!(user && user.token);
  }

  // ========== RENDEZ-VOUS ==========
  PrendreRvd(): void {
    const user = this.storageService.getUser();

    // Vérifier si c'est le propre profil
    if (user && user.id === this.id) {
      Swal.fire({
        title: 'Action non autorisée',
        text: 'Vous ne pouvez pas prendre rendez-vous avec vous-même.',
        icon: 'warning',
        confirmButtonColor: '#0857b5',
        heightAuto: false,
      });
      return;
    }

    if (user && user.token) {
      this.serviceUser.setAccessToken(user.token);

      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Voulez-vous vraiment confirmer ce rendez-vous ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, envoyer',
        cancelButtonText: 'Annuler',
        heightAuto: false,
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.rdvService.PrendreRdv(
            this.RdvForm.objet,
            this.RdvForm.dateRendezvous,
            this.RdvForm.heureRendezvous,
            this.id,
            this.RdvForm.typeRendezVousId
          ).subscribe({
            next: (data) => {
              if (data.status) {
                Swal.fire({
                  position: 'center',
                  text: data.message,
                  title: "Prise de rendez-vous envoyée",
                  icon: 'success',
                  heightAuto: false,
                  showConfirmButton: false,
                  confirmButtonColor: '#0857b5',
                  timer: 2000,
                  timerProgressBar: true,
                }).then(() => {
                  this.RdvForm.objet = "";
                  this.RdvForm.dateRendezvous = "";
                  this.RdvForm.heureRendezvous = "";
                  this.RdvForm.typeRendezVousId = "";
                });
              } else {
                Swal.fire({
                  position: 'center',
                  text: data.message,
                  title: 'Erreur',
                  icon: 'error',
                  heightAuto: false,
                  showConfirmButton: true,
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#0857b5',
                });
              }
            },
            error: (err) => {
              this.errorMessage = err.error?.message || 'Une erreur s\'est produite.';
              Swal.fire({
                position: 'center',
                text: this.errorMessage,
                title: 'Erreur',
                icon: 'error',
                heightAuto: false,
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#0857b5',
              });
            }
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'Votre session a expiré ou vous n\'êtes pas connecté.',
        icon: 'error',
        confirmButtonColor: '#0857b5',
        heightAuto: false,
      });
    }
  }

  // ========== FAVORIS ==========
  toggleFavori(): void {
    if (this.isFavori) {
      this.favorisService.retirerFavori(this.id).subscribe({
        next: () => {
          this.isFavori = false;
          Swal.fire({ title: '', text: 'Retiré des favoris', icon: 'info', timer: 1500, showConfirmButton: false, heightAuto: false });
        },
        error: (err) => {
          Swal.fire({ title: 'Erreur', text: err.error?.message || 'Erreur', icon: 'error', heightAuto: false });
        }
      });
    } else {
      this.favorisService.ajouterFavori(this.id).subscribe({
        next: () => {
          this.isFavori = true;
          Swal.fire({ title: '', text: 'Ajouté aux favoris !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        },
        error: (err) => {
          Swal.fire({ title: 'Erreur', text: err.error?.message || 'Erreur', icon: 'error', heightAuto: false });
        }
      });
    }
  }

  // ========== PARTAGE DE PROFIL ==========
  partagerProfil(): void {
    this.serviceUser.genererLienPartage().subscribe({
      next: (res) => {
        const lien = res?.lien || res?.tokenPartage || res;
        const url = `${window.location.origin}/profil/public/${lien}`;
        navigator.clipboard.writeText(url).then(() => {
          Swal.fire({ title: 'Lien copié !', text: url, icon: 'success', confirmButtonText: 'OK', heightAuto: false });
        }).catch(() => {
          Swal.fire({ title: 'Lien de partage', html: `<p>Copiez ce lien :</p><input class="swal2-input" value="${url}" readonly onclick="this.select()">`, icon: 'info', heightAuto: false });
        });
      },
      error: () => {
        Swal.fire({ title: 'Erreur', text: 'Impossible de générer le lien de partage', icon: 'error', heightAuto: false });
      }
    });
  }

  envoyerMessageProfil(): void {
    if (this.professionnel?.id) {
      this.router.navigate(['/chat', this.professionnel.id]);
    }
  }

  goToDettailProjets(id: number | undefined): Promise<boolean> {
    if (id !== undefined) {
      return this.router.navigate(['projets-détaillé', id]);
    }
    return Promise.resolve(false);
  }

  // ========== COMMENTAIRES - CRUD ==========

  /**
   * AJOUTER UN COMMENTAIRE
   */
  AjouterCommentaire(): void {
    const user = this.storageService.getUser();
    const idProfil = this.id;

    if (!user || !user.token) {
      Swal.fire({
        title: 'Erreur',
        text: 'Vous devez être connecté pour envoyer un commentaire.',
        icon: 'error',
        confirmButtonColor: '#0857b5',
        heightAuto: false,
      });
      return;
    }

    if (user.id === parseInt(idProfil)) {
      Swal.fire({
        title: 'Action non autorisée',
        text: 'Vous ne pouvez pas commenter votre propre profil.',
        icon: 'warning',
        confirmButtonColor: '#0857b5',
        heightAuto: false,
      });
      return;
    }

    if (!this.CommentaireForm.commentaires || this.CommentaireForm.commentaires.trim() === '') {
      Swal.fire({
        title: 'Erreur',
        text: 'Le commentaire ne peut pas être vide.',
        icon: 'error',
        confirmButtonColor: '#0857b5',
        heightAuto: false,
      });
      return;
    }

    if (this.CommentaireForm.commentaires.length > 500) {
      Swal.fire({
        title: 'Erreur',
        text: 'Le commentaire ne peut pas dépasser 500 caractères.',
        icon: 'error',
        confirmButtonColor: '#0857b5',
        heightAuto: false,
      });
      return;
    }

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment envoyer ce commentaire ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, envoyer',
      cancelButtonText: 'Annuler',
      heightAuto: false,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Envoi en cours...',
          text: 'Veuillez patienter',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.commentaireService.ajouterCommentaire(
          this.CommentaireForm.commentaires.trim(),
          parseInt(idProfil)
        ).subscribe({
          next: (response: any) => {
            Swal.close();
            
            if (response.success || response.status === true) {
              Swal.fire({
                position: 'center',
                text: response.message || 'Commentaire envoyé avec succès',
                title: "Succès",
                icon: 'success',
                heightAuto: false,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              }).then(() => {
                this.CommentaireForm.commentaires = "";
                // Recharger UNIQUEMENT les commentaires de CE profil
                this.chargerCommentairesDuProfil();
              });
            } else {
              Swal.fire({
                position: 'center',
                text: response.message || 'Erreur lors de l\'envoi',
                title: 'Erreur',
                icon: 'error',
                heightAuto: false,
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#0857b5',
              });
            }
          },
          error: (err) => {
            Swal.close();
            console.error('Erreur:', err);
            
            let errorMessage = 'Une erreur s\'est produite.';
            if (err.status === 401) errorMessage = 'Session expirée';
            else if (err.status === 400) errorMessage = err.error?.message || 'Paramètres invalides';
            else if (err.error?.message) errorMessage = err.error.message;
            
            Swal.fire({
              position: 'center',
              text: errorMessage,
              title: 'Erreur',
              icon: 'error',
              heightAuto: false,
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#0857b5',
            });
          }
        });
      }
    });
  }

  /**
   * Vérifier si l'utilisateur commente son propre profil
   */
  isSelfComment(): boolean {
    const user = this.storageService.getUser();
    return !!(user && this.id && user.id === this.id);
  }

  /**
   * SUPPRIMER UN COMMENTAIRE
   */
  supprimerCommentaire(idCommentaire: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentaireService.supprimerCommentaire(idCommentaire).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire({
                title: 'Succès',
                text: response.message,
                icon: 'success',
                confirmButtonColor: '#0857b5',
                heightAuto: false,
              }).then(() => {
                this.chargerCommentairesDuProfil();
              });
            } else {
              Swal.fire({
                title: 'Erreur',
                text: response.message,
                icon: 'error',
                confirmButtonColor: '#0857b5',
                heightAuto: false,
              });
            }
          },
          error: (err) => {
            Swal.fire({
              title: 'Erreur',
              text: err.error?.message || 'Erreur lors de la suppression',
              icon: 'error',
              confirmButtonColor: '#0857b5',
              heightAuto: false,
            });
          }
        });
      }
    });
  }

  /**
   * MODIFIER UN COMMENTAIRE
   */
  modifierCommentaire(idCommentaire: number, ancienContenu: string): void {
    Swal.fire({
      title: 'Modifier le commentaire',
      input: 'textarea',
      inputLabel: 'Nouveau contenu',
      inputValue: ancienContenu,
      inputValidator: (value) => {
        if (!value || value.trim() === '') return 'Le commentaire ne peut pas être vide';
        if (value.length > 500) return 'Le commentaire ne peut pas dépasser 500 caractères';
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.commentaireService.modifierCommentaire(idCommentaire, result.value).subscribe({
          next: () => {
            Swal.fire({
              title: 'Succès',
              text: 'Commentaire modifié avec succès',
              icon: 'success',
              confirmButtonColor: '#0857b5',
              heightAuto: false,
            }).then(() => {
              this.chargerCommentairesDuProfil();
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Erreur',
              text: err.error?.message || 'Erreur lors de la modification',
              icon: 'error',
              confirmButtonColor: '#0857b5',
              heightAuto: false,
            });
          }
        });
      }
    });
  }

  /**
   * Rafraîchir les commentaires du profil
   */
  rafraichirCommentaires(): void {
    this.chargerCommentairesDuProfil();
  }

  /**
   * Obtenir le nombre de commentaires du profil
   */
  getNombreCommentairesProfil(): number {
    return this.commentairesRecus?.length || 0;
  }

  /**
   * Obtenir les initiales pour l'avatar
   */
  getInitials(nom: string, prenom: string): string {
    return (prenom?.charAt(0) || '') + (nom?.charAt(0) || '');
  }
}