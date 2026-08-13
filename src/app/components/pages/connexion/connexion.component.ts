import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

declare var google: any;

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit, AfterViewInit {

  

  returnUrl: any;
  User: any;
  roles: string[] = [];
  type = true;
  selectedTab: string = 'connexion'; // Déclaration de la variable selectedTab avec la valeur par défaut 'connexion'

  isLoggedIn = false;
  isLoginFailed = false;
  connexionEnCours = false;
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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initGoogleAuth();
  }

  initGoogleAuth(): void {
    const tryInit = () => {
      if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleGoogleResponse(response),
        });
        google.accounts.id.renderButton(
          document.getElementById('google-btn-connexion'),
          { theme: 'outline', size: 'large', width: 320, text: 'signin_with', locale: 'fr' }
        );
      } else {
        setTimeout(tryInit, 300);
      }
    };
    tryInit();
  }

  handleGoogleResponse(response: any): void {
    if (!response?.credential) return;
    const credential = response.credential;

    // 1er appel : vérifier si le compte existe déjà (role ignoré pour les comptes existants)
    Swal.fire({ title: 'Connexion en cours…', allowOutsideClick: false, heightAuto: false, didOpen: () => Swal.showLoading() });

    this.authService.loginAvecGoogle(credential, 'client').subscribe({
      next: (data: any) => {
        Swal.close();
        if (data?.isNewUser) {
          // Nouveau compte → demander le rôle
          this.demanderRole(credential);
        } else {
          // Compte existant → connexion directe
          this.finalisConnexion(data);
        }
      },
      error: (err: any) => {
        Swal.fire({ text: err?.error?.message || 'Erreur Google', icon: 'error', heightAuto: false });
      }
    });
  }

  private demanderRole(credential: string): void {
    Swal.fire({
      title: 'Vous êtes ?',
      html: `
        <p style="color:#64748b;font-size:.9rem;margin-bottom:16px;">Choisissez votre type de compte</p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
          <button id="btn-professionnel"
            style="background:#086AD8;padding:14px 28px;border-radius:12px;font-size:.95rem;color:#fff;border:none;cursor:pointer;display:flex;align-items:center;gap:8px;">
            <i class="fa fa-briefcase"></i> Professionnel
          </button>
          <button id="btn-client"
            style="background:#10b981;padding:14px 28px;border-radius:12px;font-size:.95rem;color:#fff;border:none;cursor:pointer;display:flex;align-items:center;gap:8px;">
            <i class="fa fa-user"></i> Client / Entreprise
          </button>
        </div>`,
      showConfirmButton: false,
      showCancelButton: false,
      heightAuto: false,
      didOpen: () => {
        document.getElementById('btn-professionnel')?.addEventListener('click', () => {
          Swal.close();
          this.envoyerGoogleAuth(credential, 'professionnel');
        });
        document.getElementById('btn-client')?.addEventListener('click', () => {
          Swal.close();
          this.envoyerGoogleAuth(credential, 'client');
        });
      }
    });
  }

  envoyerGoogleAuth(credential: string, role: string): void {
    Swal.fire({ title: 'Création du compte…', allowOutsideClick: false, heightAuto: false, didOpen: () => Swal.showLoading() });
    this.authService.loginAvecGoogle(credential, role).subscribe({
      next: (data: any) => {
        Swal.close();
        this.finalisConnexion(data);
      },
      error: (err: any) => {
        const msg = err?.error?.message || 'Erreur de connexion avec Google';
        Swal.fire({ text: msg, icon: 'error', heightAuto: false });
      }
    });
  }

  private finalisConnexion(data: any): void {
    if (!data?.token) {
      Swal.fire({ text: 'Réponse inattendue du serveur.', icon: 'error', heightAuto: false });
      return;
    }
    this.storageService.saveUser(data);
    const roles: string[] = data.roles || [];
    const estAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPERADMIN');
    const estProfessionnel = roles.some((r: string) => r === 'ROLE_PROFESSIONNEL');
    const estEntreprise = roles.some((r: string) => r === 'ROLE_ENTREPRISE');
    const aSpecialite = !!data.specialite;
    const profilComplete = !!data.profilcompleter;
    if (estAdmin) {
      this.router.navigate(['/admin']);
    } else if (estProfessionnel && !aSpecialite && !profilComplete) {
      this.router.navigate(['/complete']);
    } else if (estProfessionnel) {
      this.router.navigate(['/profil-professionnel']);
    } else if (estEntreprise) {
      this.router.navigate(['/entreprise/dashboard']);
    } else {
      this.router.navigate(['']).then(() => window.location.reload());
    }
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
    this.connexionEnCours = true;
    this.authService.connexion(telephoneOrEmail, password).subscribe((data) => {
        this.connexionEnCours = false;
        // Enregistrez les données de l'utilisateur dans le service de stockage (session storage ou autre)
        // Vérifiez le statut de l'utilisateur
        if (data.etat === false || data.statut === false || data.statut === 0) { // Remplacez `status` par le nom reel de la propriete dans votre objet `data`
            // Affichez une notification et arrêtez la connexion
            swalWithBootstrapButtons.fire(
                "",
                `<h1 style='font-size: 1em !important; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Vous êtes banni et ne pouvez pas vous connecter.</h1>`,
                "error"
            );

            // Définissez isLoggedIn à false et isLoginFailed à true
            this.isLoggedIn = false;
            this.isLoginFailed = true;
            return; // Arrêtez l'exécution ici
        }

        // Réinitialisez les indicateurs d'erreur et définissez isLoggedIn à true
        this.isLoginFailed = false;
        this.isLoggedIn = true;

        // Obtenez les rôles de l'utilisateur à partir des données
        this.roles = data.roles || [];

        this.storageService.saveUser(data);

        // Rediriger selon le rôle et l'état du profil
        const roles: string[] = data.roles || [];
        const estAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPERADMIN');
        const estProfessionnel = roles.some((r: string) => r === 'ROLE_PROFESSIONNEL');
        const estEntreprise = roles.some((r: string) => r === 'ROLE_ENTREPRISE');
        const aSpecialite = !!data.specialite;
        const profilComplete = !!data.profilcompleter;

        if (estAdmin) {
          this.router.navigate(['/admin']);
        } else if (estProfessionnel && !aSpecialite && !profilComplete) {
          this.router.navigate(['/complete']);
        } else if (estProfessionnel) {
          this.router.navigate(['/profil-professionnel']);
        } else if (estEntreprise) {
          this.router.navigate(['/entreprise/dashboard']);
        } else {
          this.router.navigate(['']).then(() => window.location.reload());
        }

        if (this.storageService.isLoggedIn()) {
            this.isLoggedIn = true;
        } else if (!this.storageService.isLoggedIn()) {
            this.isLoginFailed = false;
        }
    }, (error) => {
        this.connexionEnCours = false;
        // Gestion des erreurs en cas d'échec de la connexion
        const errorMessage = error.error && error.error.message ? error.error.message : 'Erreur inconnue';
        console.log(error);

        // Affichage d'une notification d'erreur à l'aide de la bibliothèque SweetAlert (Swal)
        swalWithBootstrapButtons.fire(
            "",
            `<h1 style='font-size: 1em !important; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
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
