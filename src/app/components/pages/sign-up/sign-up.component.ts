import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  type = true;
  type1 = true;
  message: string | undefined;
  public currentUser = 'Choisir';
  typeUser: any[] = [
    { nom: 'CLIENT', value: 'client' },
    { nom: 'INFORMATICIEN', value: 'informaticien' }
  ];

  onChange(typeUser: any) {
    if (typeUser.value === "informaticien") {
      this.specialite;
      this.currentUser = typeUser.value;
    }else {
      // Réinitialisez la spécialité et le currentUser si un autre type d'utilisateur est sélectionné
      this.specialite = [];
      this.currentUser = 'Choisir';
    }
  }
  
  genre: any[] = [
    { nom: 'Femme', value: 'Femme' },
    { nom: 'Homme', value: 'Homme' },
    { nom: 'Autre', value: 'Autre' },
  ];
  public Toggledata = true;
  public ToggledataC = true;
  form: any = {
    nom: null,
    prenom: null,
    telephone: null,
    email: null,
    adresse: null,
    specialite : "Choisir",
    genre: "Choisir",
    password: null,
    confirmPassword: null,
    role: "Choisir"
  };
  specialite: any;

  

  constructor(
    public router: Router,
    private authService: AuthService,
    private specialiteService: SpecialiteService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    // AFFICHER LA LISTE DES INFORMATICIENS
    this.specialiteService.AfficherListeSPecialite().subscribe(data => {
      this.specialite = data;
      console.log(this.specialite);
    });
  }

  path() {
    this.router.navigate(["/connexion"]);
  }

  //METHODE PERMETTANT DE CHANGER LE TYPE DE L'ICON EYE DANS LE CHAMP MOT DE PASSE
  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }

  //METHODE PERMETTANT DE CHANGER LE TYPE DE L'ICON EYE DANS LE CHAMP MOT DE PASSE
  iconLogleC() {
    this.ToggledataC = !this.ToggledataC;
  }

  //METHODE PERMETTANT DE S'INSCRIRE
  inscription(): void {
    if (this.form.password !== this.form.confirmPassword) {
      Swal.fire({
        text: "La confirmation du mot de passe ne correspond pas au nouveau mot de passe.",
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false // Ajoutez cette option pour désactiver la hauteur automatique
      });
      return;
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    const { nom, prenom, telephone, email, adresse, specialite, genre, password, role } = this.form;

    swalWithBootstrapButtons.fire({
      text: "Etes-vous sûre de creer un compte ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.inscription(nom, prenom, telephone, adresse, genre, email,specialite, password, role).subscribe({
          next: data => {
            this.isSuccessful = true;
            this.isSignUpFailed = false;
            Swal.fire({
              position: 'center',
              text: data.message,
              title: 'Creation de compte',
              icon: 'success',
              heightAuto: false,
              showConfirmButton: true,
              confirmButtonText: "OK",
              confirmButtonColor: '#0857b5',
              showDenyButton: false,
              showCancelButton: false,
              allowOutsideClick: false,

            }).then((result) => {
              this.path();
            })
            console.log(data);

          }, error: err => {
            this.errorMessage = err.error.message;
            this.isSignUpFailed = true;
            const errorMessage = err.error && err.error.message ? err.error.message : 'Erreur inconnue';
            // console.log(error);
            swalWithBootstrapButtons.fire(
              "",
              `<h1 style='font-size: 1em !important; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
              "error"
            );
          }
        });
      };
    })
    // }
  }


  //POPUP APRES CONFIRMATION
  popUpConfirmation() {
    const messages = [
      'Le compte a été envoyé avec succès.',
      'Pour vous connecter, allez-y confirmer dans votre mail'
    ];
    const messageText = messages.join('\n');

    Swal.fire({
      position: 'center',
      text: messageText,
      title: 'Creation de compte',
      icon: 'success',
      heightAuto: false,
      showConfirmButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: '#0857b5',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,

    }).then((result) => {
      this.form.nom = '',
        this.form.prenom = '',
        this.form.telephone = '',
        this.form.email = '',
        this.form.genre = "Choisir",
        this.form.adresse = '',
        this.form.password = '',
        this.form.confirmPassword = '',
        this.form.roles = "Choisir"
    })
  }

}
