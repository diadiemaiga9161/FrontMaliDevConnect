import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
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
  selectedTab: string = 'profil'
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


  constructor(
    private serviceUser: UserService,
    private storageService: StorageService,
    private authService: AuthService,
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
      specialite: this.User.specialite.id,
    };
  }

  ngOnInit(): void {

    // AFFICHER LA LISTE DES INFORMATICIENS
    this.specialiteService.AfficherListeSPecialite().subscribe(data => {
      this.specialite = data;
      console.log(this.specialite);
    });

    //AFFICHER UN INFORMATICIEN EN FONCTION DE SON ID
    this.serviceUser.AfficherInformaticienParId(this.User.id).subscribe(data => {
      this.nombreexperience = data?.experienceProfessionnelles?.length;
      this.nombreprojet = data?.projetInformatiques?.length;
      console.log(this.informaticien);
    });
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
              console.log('Photo changed successfully', successResponse);
              console.log('Photo ', photo);
              this.User.photos[0].nom = photo.name;
              user.photos[0].nom = successResponse.message;
              this.storageService.setUser(user);
              console.log(this.User.photos[0].nom);
              this.User.photos[0].nom = photo.name;
              // this.generateImageUrl(photo.name);
              // Mettez à jour le chemin de l'image de profil
              this.profileImageUrl = this.generateImageUrl(photo.name) + '?timestamp=' + new Date().getTime();
              const uniqueFileName = photo.name + `?timestamp=${new Date().getTime()}`;
              this.User.photos[0].nom = uniqueFileName;
              this.reloadPage();
          },
          error => {
              // console.error('Error while changing photo', error);
          }
      );
  } else {
      // console.error('Token JWT missing or no photo selected');
  }
}


}
