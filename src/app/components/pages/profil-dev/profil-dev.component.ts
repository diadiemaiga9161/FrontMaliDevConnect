import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import  { RdvService } from 'src/app/services/rendezVous/rendezVous.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TyperdvService } from 'src/app/services/typerdv/typerdv.service';
import { ExperienceService } from 'src/app/services/experience/experience.service';

import Swal from 'sweetalert2';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { CommentaireService } from 'src/app/services/commentaire/commentaire.service';


const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-profil-dev',
  templateUrl: './profil-dev.component.html',
  styleUrls: ['./profil-dev.component.scss']
})
export class ProfilDevComponent implements OnInit {


  selectedTab: string = 'profil'
  id: any;
  informaticien: any;
  specialite: any;
  projet: any;
  experienceProfessionnelle: any;
  non: any;
  typerdv: any;
  typeConnaissances: any;
  connaissances: any;
  connaissance: any;
  profileImageUrl: string = ''; // Variable pour stocker le chemin de l'image de profil
User: any;
errorMessage: any = '';
  isSuccess: any = false;
  isError: any = false;
  isLoggedIn = false;
  isLoginFailed = true;
  type: any;
  commentaire: any;


    //IMAGE
    generateImageUrl(photoFileName: string): string {
      const baseUrl = URL_PHOTO;
      return baseUrl + photoFileName;
    }
      // IMAGE PAR DEFAUT USER
   handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/tiec.jpg';
  }

  
  constructor(
    private route: ActivatedRoute,
    private serviceUser: UserService,
    private experienceService:ExperienceService,
    private commentaireService: CommentaireService,
    private serviceTypeRdv: TyperdvService,
    private connaissanceService : ConnaissanceService,
    private storageService: StorageService,
    private rdvService: RdvService,
    public router: Router,
  ) { }
  

  form: any = {
    commentaires: null,
    idinf: null
  };

  ngOnInit(): void {
    //RECUPERER L'ID DE L'INFORMATICIEN
    this.id = +this.route.snapshot.params["id"]

     // AFFICHER LA LISTE DES INFORMATICIENS
     this.serviceTypeRdv.AfficherListeTyperdv().subscribe(data => {
      this.typerdv = data;
      console.log(this.typerdv);
    });

    // this.experienceService.AfficherListEexperienceProfessionnelle().subscribe(data => {
    //   this.type = data;
    //   console.log(this.type);
    // });

    // this.commentaireService.AfficherListeCommentaire().subscribe(data => {
    //   this.type = data;
    //   console.log(this.type);
    // });

    
    this.connaissanceService.AfficherListeConnaissance().subscribe(data => {
      this.connaissance = data;
      console.log(this.connaissance);
    });



    //AFFICHER UN INFORMATICIEN EN FONCTION DE SON ID
    this.serviceUser.AfficherInformaticienParId(this.id).subscribe(data => {
      this.informaticien = data;
      this.specialite = data?.specialite;
      this.projet = data?.projetInformatiques;
      this.commentaire = data?.commentaires;
      this.connaissances = data?.connaissance;
      this.experienceProfessionnelle = this.informaticien.experienceProfessionnelles;
      console.log(this.informaticien);
    });

    
    
  }

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
  }

  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.selectedTab === tab;
  }
  
  //METHODE PERMETTANT DE PRENDRE UN RENDEZ-VOUS
  PrendreRvd(): void {
    this.id = this.route.snapshot.params["id"];
    const user = this.storageService.getUser();
  
    if (user && user.token) {
      // Définissez le token dans le service serviceUser
      this.serviceUser.setAccessToken(user.token);
  
      // Boîte de confirmation avant d'envoyer le rendez-vous
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
        reverseButtons: true, // Positionne le bouton Annuler à gauche
      }).then((result) => {
        if (result.isConfirmed) {
          // Si l'utilisateur confirme, envoyez le rendez-vous
          this.rdvService.PrendreRdv(
            this.RdvForm.objet,
            this.RdvForm.dateRendezvous,
            this.RdvForm.heureRendezvous,
            this.id,
            this.RdvForm.typeRendezVousId
          ).subscribe({
            next: (data) => {
              if (data.status) {
                let timerInterval = 2000;
                Swal.fire({
                  position: 'center',
                  text: data.message,
                  title: "Prise de rendez-vous envoyée",
                  icon: 'success',
                  heightAuto: false,
                  showConfirmButton: false,
                  confirmButtonColor: '#0857b5',
                  timer: timerInterval,
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
              this.errorMessage = err.error.message || 'Une erreur s\'est produite.';
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
      // Si le token est manquant
      Swal.fire({
        title: 'Erreur',
        text: 'Votre session a expiré ou vous n\'êtes pas connecté.',
        icon: 'error',
        confirmButtonColor: '#0857b5',
        heightAuto: false,
      });
    }
  }
  

  goToDettailProjets(id: number | undefined): Promise<boolean> {
    if (id !== undefined) {
      return this.router.navigate(['projets-détaillé', id]);
    }
    // Gérer le cas où id est indéfini (facultatif)
    return Promise.resolve(false); // Retourner une promesse résolue avec `false` (ou une autre valeur appropriée)
  }

  // goToDettailInformaticien(id: number | undefined): Promise<boolean> {
  //   if (id !== undefined) {
  //     return this.router.navigate(['profil-détaillé', id]);
  //   }
  //   // Gérer le cas où id est indéfini (facultatif)
  //   return Promise.resolve(false); // Retourner une promesse résolue avec `false` (ou une autre valeur appropriée)
  // }
  // AjouterCommentaire(): void {
  //   this.id = this.route.snapshot.params["id"];
  //   const user = this.storageService.getUser();
  
  //   if (user && user.token) {
  //     // Définissez le token dans le service serviceUser
  //     this.serviceUser.setAccessToken(user.token);
  
  //     // Validation du formulaire avant de procéder
  //     if (!this.CommentaireForm.commentaires || this.CommentaireForm.commentaires.trim() === "") {
  //       this.errorMessage = "Le commentaire est obligatoire.";
  //       this.isError = true;
  //       return;
  //     }
  
  //     // Appel du service pour ajouter un commentaire
  //     this.commentaireService.Commentaire(this.CommentaireForm.commentaires, this.id).subscribe({
  //       next: (data) => {
  //         if (data.status) {
  //           Swal.fire({
  //             position: 'center',
  //             text: data.message,
  //             title: "Commentaire envoyé",
  //             icon: 'success',
  //             heightAuto: false,
  //             showConfirmButton: false,
  //             confirmButtonColor: '#0857b5',
  //             timer: 2000,
  //             timerProgressBar: true,
  //           }).then(() => {
  //             // Réinitialisation du formulaire après succès
  //             this.CommentaireForm.commentaires = "";
  //             this.isSuccess = true;
  //             this.errorMessage = "";
  //           });
  //         } else {
  //           // Gestion des erreurs côté serveur
  //           Swal.fire({
  //             position: 'center',
  //             text: data.message,
  //             title: 'Erreur',
  //             icon: 'error',
  //             heightAuto: false,
  //             showConfirmButton: true,
  //             confirmButtonText: 'OK',
  //             confirmButtonColor: '#0857b5',
  //           });
  //         }
  //       },
  //       error: (err) => {
  //         // Gestion des erreurs côté client
  //         console.error("Erreur lors de l'envoi du commentaire :", err);
  //         this.errorMessage = err.error?.message || "Une erreur inattendue s'est produite.";
  //         this.isError = true;
  //       },
  //     });
  //   } else {
  //     console.error("Token JWT manquant");
  //     this.errorMessage = "Vous devez être connecté pour envoyer un commentaire.";
  //     this.isError = true;
  //   }
  // }
  
  AjouterCommentaire(): void {
    this.id = this.route.snapshot.params["id"];
    const user = this.storageService.getUser();
  
    if (user && user.token) {
      // Définissez le token dans le service serviceUser
      this.serviceUser.setAccessToken(user.token);
  
      // Boîte de confirmation avant d'envoyer le commentaire
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
        reverseButtons: true, // Positionne le bouton Annuler à gauche
      }).then((result) => {
        if (result.isConfirmed) {
          // Si l'utilisateur confirme, envoyez le commentaire
          this.commentaireService.Commentaire(this.CommentaireForm.commentaires, this.id).subscribe({
            next: (data) => {
              if (data.status) {
                let timerInterval = 2000;
                Swal.fire({
                  position: 'center',
                  text: data.message,
                  title: "Commentaire envoyé",
                  icon: 'success',
                  heightAuto: false,
                  showConfirmButton: false,
                  confirmButtonColor: '#0857b5',
                  timer: timerInterval,
                  timerProgressBar: true,
                }).then(() => {
                  this.CommentaireForm.commentaires = "";
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
              this.errorMessage = err.error.message || 'Une erreur s\'est produite.';
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
      // Si le token est manquant
      Swal.fire({
        title: 'Erreur',
        text: 'Votre session a expiré ou vous n\'êtes pas connecté.',
        icon: 'error',
        confirmButtonColor: '#0857b5',
        heightAuto: false,
      });
    }
  }
  
  
  // AjouterCommentaire(): void {
  //   this.id = this.route.snapshot.params["id"]
  //   const user = this.storageService.getUser(); // Récupérer l'utilisateur connecté depuis le localStorage
  //   if (user && user.token) {
  //     this.commentaireService
  //       .Commentaire(this.CommentaireForm.commentaire, this.CommentaireForm.userRecu)
  //       .subscribe({
  //         next: (data) => {
  //           if (data.status) {
  //             Swal.fire({
  //               position: 'center',
  //               text: data.message,
  //               title: "Commentaire ajouté avec succès",
  //               icon: 'success',
  //               heightAuto: false,
  //               showConfirmButton: false,
  //               confirmButtonColor: '#0857b5',
  //               timer: 2000,
  //               timerProgressBar: true
  //             }).then(() => {
  //               // Réinitialiser le formulaire après succès
  //               this.CommentaireForm.commentaire = '';
  //               this.CommentaireForm.userRecu = '';
  //             });
  //           } else {
  //             Swal.fire({
  //               position: 'center',
  //               text: data.message,
  //               title: 'Erreur',
  //               icon: 'error',
  //               heightAuto: false,
  //               confirmButtonText: 'OK',
  //               confirmButtonColor: '#0857b5'
  //             });
  //           }
  //         },
  //         error: (err) => {
  //           this.errorMessage = err.error.message || 'Une erreur est survenue.';
  //           Swal.fire({
  //             position: 'center',
  //             text: this.errorMessage,
  //             title: 'Erreur',
  //             icon: 'error',
  //             heightAuto: false,
  //             confirmButtonText: 'OK',
  //             confirmButtonColor: '#0857b5'
  //           });
  //         }
  //       });
  //   } else {
  //     console.error('Token JWT manquant');
  //   }
  // }
}

