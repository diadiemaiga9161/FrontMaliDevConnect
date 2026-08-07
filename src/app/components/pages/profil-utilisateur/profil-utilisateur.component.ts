import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RdvService } from 'src/app/services/rendezVous/rendezVous.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-profil-user',
  templateUrl: './profil-utilisateur.component.html',
  styleUrls: ['./profil-utilisateur.component.scss']
})

export class ProfilUtilisateurComponent implements OnInit {
  selectedTab: string = 'profil';
  selectedSousTab: string = 'tous';
  id: any;
  informaticien: any;
  specialite: any;
  projet: any;
  User: any;
  form: any;
  isSuccessful = false;
  isSignUpFailed = false;
  profileImageUrl: string = ''; // Variable pour stocker le chemin de l'image de profil
  errorMessage = '';
  nombreprojet: number = 0;
  nombreexperience: number = 0;
 
  rdvRecus: any[] = [];
  rdvEnvoyes: any[] = [];
  rdvEnAttente: any[] = [];
  rdvAcceptes: any[] = [];
  rdvRefuses: any[] = [];
  rdvAnnules: any[] = [];
  
  // Pagination
  pRecus: number = 1;
  pEnvoyes: number = 1;
  pEnAttente: number = 1;
  pAcceptes: number = 1;

  motifAction: string = '';
  rdvSelectionne: any = null;
  actionEnCours: string = '';

  constructor(
    private serviceUser: UserService,
    private storageService: StorageService,
    private authService: AuthService,
    private rdvService:  RdvService,
    private specialiteService: SpecialiteService,
    private router: Router,
  ) {
    this.User = this.storageService.getUser();
    this.form = {
      nom: this.User.nom,
      prenom: this.User.prenom,
      telephone: this.User.telephone,
      email: this.User.email,
      genre: this.User.genre,
      adresse: this.User.adresse,
      specialite: this.User?.specialite?.id,
    };
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  afficherNotifications(rdv: any) {
    throw new Error('Method not implemented.');
  }


  loadAllData(): void {
    this.loadRendezVousRecus();
    this.loadRendezVousEnvoyes();
    this.loadRendezVousNonNotifies();
  }
  loadRendezVousEnvoyes(): void {
    // Rendez-vous envoyés (ceux que j'ai pris)
    this.rdvService.AfficherRdvParEnvoyerParUserConnecterNew().subscribe(data => {
      this.rdvEnvoyes = data || [];
      console.log('Rendez-vous envoyés (pris par moi):', this.rdvEnvoyes);
    }, error => {
      console.error('Erreur chargement RDV envoyés:', error);
      this.rdvEnvoyes = [];
    });
  }
  loadRendezVousRecus(): void {
    // Rendez-vous reçus
    this.rdvService.AfficherRdvParRecuParUserConnecter().subscribe(data => {
      this.rdvRecus = data || [];
      console.log('Rendez-vous reçus:', this.rdvRecus);
      
      // Filtrer par statut
      this.rdvEnAttente = this.rdvRecus.filter(rdv => rdv?.statut === 'EN_ATTENTE');
      this.rdvAcceptes = this.rdvRecus.filter(rdv => rdv?.statut === 'ACCEPTE');
      this.rdvRefuses = this.rdvRecus.filter(rdv => rdv?.statut === 'REFUSE');
      this.rdvAnnules = this.rdvRecus.filter(rdv => rdv?.statut === 'ANNULE');
    }, error => {
      console.error('Erreur chargement RDV reçus:', error);
      this.rdvRecus = [];
    });
  }
  loadRendezVousNonNotifies(): void {
    this.rdvService.AfficherRdvParRecuParUserConnecters().subscribe(data => {
      console.log('Rendez-vous non notifiés:', data);
      if (data && data.length > 0) {
        this.showNotifications(data);
      }
    }, error => {
      console.error('Erreur chargement RDV non notifiés:', error);
    });
  }
  // ============= METHODES POUR LES RENDEZ-VOUS =============

  // Accepter un rendez-vous
  AccepterRendezVous(rdv: any): void {
    Swal.fire({
      title: 'Accepter le rendez-vous',
      text: `Voulez-vous accepter le rendez-vous de ${rdv?.userenvoyer?.prenom || ''} ${rdv?.userenvoyer?.nom || ''} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, accepter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#28a745'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rdvService.AccepterRendezVous(rdv.id).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Succès!',
              text: response.message || 'Rendez-vous accepté avec succès',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.loadRendezVousRecus(); // Recharger les données
          },
          error: (error) => {
            Swal.fire({
              title: 'Erreur!',
              text: error.error?.message || 'Erreur lors de l\'acceptation du rendez-vous',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  // Refuser un rendez-vous avec motif
  RefuserRendezVous(rdv: any): void {
    Swal.fire({
      title: 'Refuser le rendez-vous',
      html: `
        <p>Voulez-vous refuser le rendez-vous de ${rdv?.userenvoyer?.prenom || ''} ${rdv?.userenvoyer?.nom || ''} ?</p>
        <div class="form-group mt-3">
          <label for="motifRefus">Motif du refus (optionnel):</label>
          <textarea id="motifRefus" class="swal2-textarea" placeholder="Saisissez le motif du refus..."></textarea>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, refuser',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc3545',
      preConfirm: () => {
        const motif = (document.getElementById('motifRefus') as HTMLTextAreaElement)?.value;
        return this.rdvService.RefuserRendezVous(rdv.id, motif).toPromise();
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Refusé!',
          text: 'Rendez-vous refusé avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.loadRendezVousRecus();
      }
    }).catch((error) => {
      Swal.fire({
        title: 'Erreur!',
        text: error.error?.message || 'Erreur lors du refus du rendez-vous',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  // Annuler un rendez-vous que j'ai pris
  AnnulerRendezVous(rdv: any): void {
    Swal.fire({
      title: 'Annuler le rendez-vous',
      html: `
        <p>Voulez-vous annuler votre rendez-vous avec ${rdv?.user?.prenom || ''} ${rdv?.user?.nom || ''} ?</p>
        <div class="form-group mt-3">
          <label for="motifAnnulation">Motif de l'annulation (optionnel):</label>
          <textarea id="motifAnnulation" class="swal2-textarea" placeholder="Saisissez le motif de l'annulation..."></textarea>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non',
      confirmButtonColor: '#ffc107',
      preConfirm: () => {
        const motif = (document.getElementById('motifAnnulation') as HTMLTextAreaElement)?.value;
        return this.rdvService.AnnulerRendezVous(rdv.id, motif).toPromise();
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Annulé!',
          text: 'Rendez-vous annulé avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.loadRendezVousEnvoyes();
      }
    }).catch((error) => {
      Swal.fire({
        title: 'Erreur!',
        text: error.error?.message || 'Erreur lors de l\'annulation du rendez-vous',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  // Voir les détails d'un rendez-vous
  VoirDetailsRdv(rdv: any): void {
    this.rdvSelectionne = rdv;
    
    const statutLibelle = this.getStatutLibelle(rdv?.statut);
    const statutCouleur = this.getStatutCouleur(rdv?.statut);
    
    let motifHtml = '';
    if (rdv?.motifAnnulation) {
      motifHtml = `<p><strong>Motif:</strong> ${rdv.motifAnnulation}</p>`;
    }
    
    let datesHtml = '';
    if (rdv?.dateAcceptation) {
      datesHtml += `<p><strong>Accepté le:</strong> ${new Date(rdv.dateAcceptation).toLocaleString()}</p>`;
    }
    if (rdv?.dateAnnulation) {
      datesHtml += `<p><strong>Annulé/Refusé le:</strong> ${new Date(rdv.dateAnnulation).toLocaleString()}</p>`;
    }
    
    Swal.fire({
      title: 'Détails du rendez-vous',
      html: `
        <div style="text-align: left;">
          <p><strong>Objet:</strong> ${rdv?.objet || 'Non spécifié'}</p>
          <p><strong>Date:</strong> ${rdv?.date || 'Non spécifiée'}</p>
          <p><strong>Heure:</strong> ${rdv?.heure || 'Non spécifiée'}</p>
          <p><strong>Type:</strong> ${rdv?.typerdv?.typerdv || 'Non spécifié'}</p>
          <p><strong>Statut:</strong> <span class="badge bg-${statutCouleur}">${statutLibelle}</span></p>
          ${motifHtml}
          ${datesHtml}
          <p><strong>Créé le:</strong> ${new Date(rdv?.createdAt).toLocaleString()}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Fermer'
    });
  }

  // Afficher les notifications (renommé pour éviter le conflit)
  showNotifications(rdvs: any[]): void {
    if (rdvs && rdvs.length > 0) {
      const nouveauRdv = rdvs[0];
      Swal.fire({
        title: 'Nouveau rendez-vous!',
        html: `
          <p>Vous avez reçu un nouveau rendez-vous de <strong>${nouveauRdv?.userenvoyer?.prenom || ''} ${nouveauRdv?.userenvoyer?.nom || ''}</strong></p>
          <p><strong>Objet:</strong> ${nouveauRdv?.objet || ''}</p>
          <p><strong>Date:</strong> ${nouveauRdv?.date || ''} à ${nouveauRdv?.heure || ''}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Voir',
        showCancelButton: true,
        cancelButtonText: 'Plus tard'
      }).then((result) => {
        if (result.isConfirmed) {
          this.selectedTab = 'rendezvous';
          this.VoirDetailsRdv(nouveauRdv);
        }
      });
    }
  }


  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/amadou.jpg';
  }

  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return `${URL_PHOTO}${photoFileName}`;
  }
 
 

  changeTab(tab: string) {
    this.selectedTab = tab;
    // Réinitialiser le sous-onglet quand on change d'onglet principal
    if (tab === 'rendezvous') {
      this.selectedSousTab = 'tous';
    }
  }

  isTabActive(tab: string): boolean {
    return this.selectedTab === tab;
  }

  ChangeMdpForm: any = {
    oldPassword: null,
    newPassword: null,
    password2: null,
  }

  type = true;
  type1 = true;
  type2 = true;


  //METHODE PERMETTANT DE CHANGER LE TYPE DE L'ICON EYE DANS LE CHAMP MOT DE PASSE
  changeType() {
    this.type = !this.type;
  }
  //METHODE PERMETTANT DE CHANGER LE TYPE DE L'ICON EYE DANS LE CHAMP MOT DE PASSE
  changeType1() {
    this.type1 = !this.type1;
  }

  //METHODE PERMETTANT DE CHANGER LE TYPE DE L'ICON EYE DANS LE CHAMP MOT DE PASSE
  changeType2() {
    this.type2 = !this.type2;
  }

  //METHODE PERMETTANT DE CHANGER SON MOT DE PASSE
  ModifierMotDePasse(): void {
    const { oldPassword, newPassword, password2 } = this.ChangeMdpForm;
    if (this.ChangeMdpForm.newPassword !== this.ChangeMdpForm.password2) {
      console.log("Pas les memes");
      console.log(this.ChangeMdpForm.newPassword);
      console.log(this.ChangeMdpForm.password2);

      Swal.fire({
        text: "La confirmation du mot de passe ne correspond pas au nouveau mot de passe.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return; // Sortir de la fonction si les mots de passe ne correspondent pas
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      text: "Etes-vous sûre de changer votre mot de passe ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const user = this.storageService.getUser();
        if (user && user.token) {
          // Définissez le token dans le service notificationService
          this.serviceUser.setAccessToken(user.token);

          // Appelez la méthode ChangerMotDePasse() avec le old_password et password
          this.serviceUser.modifierMotDePasse(oldPassword, newPassword).subscribe(
            data => {
              // console.log("Mot de passe changé avec succès:", data);
              // this.isSuccess = false;
              // Afficher le premier popup de succès
              this.popUpConfirmation();
            },
            error => {
              // console.error("Erreur lors du changement de mot de passe :", error);
              // Gérez les erreurs ici
              const errorMessage = error.error && error.error.message ? error.error.message : 'Erreur inconnue';
              console.log(error);
              swalWithBootstrapButtons.fire(
                "",
                `<h1 style='font-size: 1em !important; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
                "error"
              );
            }
          );
        } else {
          // console.error("Token JWT manquant");
        }
      }
    })
  }

  //POPUP APRES CHANGEMENT DE MOT DE PASSE
  popUpConfirmation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Le mot de passe a été modifié avec succès.',
      title: 'Mot de passe modifié',
      icon: 'success',
      heightAuto: false,
      showConfirmButton: false,
      // confirmButtonText: "OK",
      confirmButtonColor: '#0857b5',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      timer: timerInterval, // ajouter le temps d'attente
      timerProgressBar: true // ajouter la barre de progression du temps

    }).then((result) => {
      //REDIRECTION ET DECONNECTION APRES LE CHANGEMENT DE MOT DE PASSE
      this.authService.logout().subscribe({
        next: res => {
          // console.log(res);
          this.storageService.clean();
          this.router.navigateByUrl("/")
        },
        error: err => {
          // console.log(err);
        }
      });
    })

  }

  //METHODE PERMETTANT DE MODIFIER LE PROFIL D'UN UTILISATEUR
  ModifierProfilUser() {
    const { nom, prenom, telephone, email, genre, adresse } = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de modifier votre profil?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const user = this.storageService.getUser();
        if (user && user.token) {
          // Définissez le token dans le service serviceUser
          this.serviceUser.setAccessToken(user.token);
          this.serviceUser.modifierProfilUser(nom, prenom, telephone, adresse, genre, email).subscribe({
            next: data => {
              // console.log(data);

              // Mise à jour des données utilisateur dans le sessionStorage
              const updatedUser = this.storageService.getUser(); // Récupérez l'utilisateur du sessionStorage
              console.log(updatedUser);

              if (updatedUser) {
                // Mise à jour des données de l'utilisateur avec les données mises à jour du serveur
                updatedUser.nom = data.nom;
                updatedUser.prenom = data.prenom;
                updatedUser.telephone = data.telephone;
                updatedUser.email = data.email;

                // Mise à jour des données dans le sessionStorage avec les données mises à jour
                this.storageService.setUser(updatedUser); // Utilisez l'utilisateur mis à jour
              }
              this.isSuccessful = true;
              this.isSignUpFailed = false;
              this.popUpModificationProfilUser();
            },
            error: err => {
              const errorMessage = err.error && err.error.message ? err.error.message : 'Erreur inconnue';
              console.log(errorMessage);
              swalWithBootstrapButtons.fire(
                "",
                `<h1 style='font-size: 1em !important; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
                "error"
              );
              // this.errorMessage = err.error.message;
              // console.log(this.errorMessage);
              this.isSignUpFailed = true;
            }
          });

        } else {
          // console.error("Token JWT manquant");
        }
      }
    })

  }

  //POPUP APRES MODIFICATION PROFIL
  popUpModificationProfilUser() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Profil modifié avec succès.',
      title: 'Modification de profil',
      icon: 'success',
      heightAuto: false,
      showConfirmButton: false,
      // confirmButtonText: "OK",
      confirmButtonColor: '#0857b5',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      timer: timerInterval, // ajouter le temps d'attente
      timerProgressBar: true // ajouter la barre de progression du temps

    }).then(() => {
      this.form.nom;
      this.form.prenom;
      this.form.telephone;
      this.form.email;
      this.reloadPage()
    })
  }

  reloadPage(): void {
    window.location.reload();
  }

  onPhotoChange(event: any): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
        const maxSize = 5 * 1024 * 1024; // Taille maximale en octets (5 Mo)

        if (selectedFile.size <= maxSize) {
            // Vous pouvez également afficher des informations sur le fichier si nécessaire
            // console.log(`Nom du fichier: ${selectedFile.name}`);
            // console.log(`Type de fichier: ${selectedFile.type}`);
            // console.log(`Taille du fichier: ${selectedFile.size} octets`);

            // Ajoutez le fichier au formulaire et exécutez votre logique d'ajout ici
            this.form.photo = selectedFile;
            this.onAdd();
        } else {
            alert("La taille du fichier est supérieure à 5 Mo. Veuillez choisir un fichier plus petit.");
            // Réinitialiser la sélection de fichier
            event.target.value = '';
        }
    }
}

//AJOUTER LA PHOTO DE PROFIL
onAdd(): void {
  // console.log('Add button clicked');
  const { photo } = this.form;
  const user = this.storageService.getUser();
  if (user && user.token && photo) {
      this.serviceUser.changerPhoto(photo).subscribe(
          successResponse => {
              const newPath = successResponse.message;
              if (!user.photos || user.photos.length === 0) {
                  user.photos = [{ nom: newPath }];
              } else {
                  user.photos[0].nom = newPath;
              }
              user.utilisateurPhoto = { nom: newPath };
              this.storageService.setUser(user);
              this.reloadPage();
          },
          error => {}
      );
  } else {
      // console.error('Token JWT missing or no photo selected');
  }
}

goToDettailRdv(id: number | undefined): Promise<boolean> {
  if (id !== undefined) {
    return this.router.navigate(['/details-rdv', id]);
  }
  return Promise.resolve(false);
}

// Méthodes utilitaires pour les statuts
getStatutLibelle(statut: string): string {
  const statuts: { [key: string]: string } = {
    'EN_ATTENTE': 'En attente',
    'ACCEPTE': 'Accepté',
    'REFUSE': 'Refusé',
    'ANNULE': 'Annulé'
  };
  return statuts[statut] || statut || 'Inconnu';
}

getStatutCouleur(statut: string): string {
  const couleurs: { [key: string]: string } = {
    'EN_ATTENTE': 'warning',
    'ACCEPTE': 'success',
    'REFUSE': 'danger',
    'ANNULE': 'secondary'
  };
  return couleurs[statut] || 'dark';
}

getStatutIcone(statut: string): string {
  const icones: { [key: string]: string } = {
    'EN_ATTENTE': 'clock',
    'ACCEPTE': 'check-circle',
    'REFUSE': 'times-circle',
    'ANNULE': 'ban'
  };
  return icones[statut] || 'circle';
}

// Vérifier les permissions
peutAccepter(rdv: any): boolean {
  return rdv && rdv.statut === 'EN_ATTENTE' && rdv.user?.id === this.User?.id;
}

peutRefuser(rdv: any): boolean {
  return rdv && rdv.statut === 'EN_ATTENTE' && rdv.user?.id === this.User?.id;
}

peutAnnuler(rdv: any): boolean {
  return rdv && 
         (rdv.statut === 'EN_ATTENTE' || rdv.statut === 'ACCEPTE') && 
         rdv.userEvoyer?.id === this.User?.id;
}

}

