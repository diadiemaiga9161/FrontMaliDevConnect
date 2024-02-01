import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  returnUrl: any;
  User: any;
  roles: string[] = [];
  type = true;
  selectedTab: string = 'connexion'; // Déclaration de la variable selectedTab avec la valeur par défaut 'connexion'

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  passwordFieldType: string = 'password';

  // Définissez une méthode pour basculer entre les types de champ de mot de passe
  togglePasswordVisibility() {
    this.passwordFieldType = (this.passwordFieldType === 'password') ? 'text' : 'password';
  }

  form: any = {
    telephoneOrEmail: null,
    password: null,
  };


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
  }

  path() {
    this.router.navigate(["/"]);
  }

  public Toggledata = true;

  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }

  //METHODE PERMETTANT DE SE CONNECTER
  seConnecter(): void {
    const { telephoneOrEmail, password } = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: '',
        cancelButton: '',
      },
      heightAuto: false
    });

    // Appel du service AuthService pour gérer la connexion de l'utilisateur
    this.authService.connexion(telephoneOrEmail, password).subscribe((data) => {
      // Enregistrez les données de l'utilisateur dans le service de stockage (session storage ou autre)
      this.storageService.saveUser(data);

      console.log(data);

      // Réinitialisez les indicateurs d'erreur et définissez isLoggedIn à true
      this.isLoginFailed = false;
      this.isLoggedIn = true;

      // Obtenez les rôles de l'utilisateur à partir des données
      this.roles = this.storageService.getUser().roles;

        this.router.navigate(['']).then(() => {
            window.location.reload();
          });
      // Redirigez l'utilisateur vers la page d'accueil
      // this.reloadPage()
      if (this.storageService.isLoggedIn()) {
        this.isLoggedIn = true;
      } else if (!this.storageService.isLoggedIn()) {
        this.isLoginFailed = false;
      }
    }, (error) => {
      // Gestion des erreurs en cas d'échec de la connexion
      const errorMessage = error.error && error.error.message ? error.error.message : 'Erreur inconnue';
      console.log(error);

      // Affichage d'une notification d'erreur à l'aide de la bibliothèque SweetAlert (Swal)
      swalWithBootstrapButtons.fire(
        "",
        `<h1 style='font-size: 1em !important; font-weight; bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
        "error"
      );

      // Définissez isLoginFailed à true pour indiquer que la connexion a échoué
      this.isLoginFailed = true;
    });
  }

  // Méthode pour changer l'onglet sélectionné
  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  // Méthode pour vérifier si un onglet est actif
  isTabActive(tab: string): boolean {
    return this.selectedTab === tab;
  }
}
