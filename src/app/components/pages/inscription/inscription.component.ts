import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { environment } from 'src/environments/environment';

declare var google: any;

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})

export class InscriptionComponent implements OnInit, AfterViewInit {

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  inscriptionEnCours = false;
  type = true;
  type1 = true;
  message: string | undefined;
  public currentUser = 'Choisir';
  typeUser: any[] = [
    { nom: 'Client', value: 'client' },
    { nom: 'Professionnel', value: 'professionnel' },
    { nom: 'Entreprise', value: 'entreprise' }
  ];

  onChange(typeUser: any) {
    this.form.role = typeUser.value;
    if (typeUser.value === "professionnel") {
      this.currentUser = typeUser.value;
    } else {
      this.currentUser = 'Choisir';
    }
  }

  onSpecialiteChange(event: any) {
    console.log("Spécialité sélectionnée:", event.target.value);
    this.form.specialite = event.target.value;
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
    this.specialiteService.AfficherListeSPecialite().subscribe(data => {
      this.specialite = data;
    });
  }

  ngAfterViewInit(): void {
    const tryInit = () => {
      if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleGoogleResponse(response),
        });
        google.accounts.id.renderButton(
          document.getElementById('google-btn-inscription'),
          { theme: 'outline', size: 'large', width: 320, text: 'signup_with', locale: 'fr' }
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

    // 1er appel : vérifier si le compte existe déjà
    Swal.fire({ title: 'Vérification…', allowOutsideClick: false, heightAuto: false, didOpen: () => Swal.showLoading() });

    this.authService.loginAvecGoogle(credential, 'client').subscribe({
      next: (data: any) => {
        Swal.close();
        if (data?.isNewUser) {
          this.demanderRole(credential);
        } else {
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
    const { nom, prenom, telephone, genre, email, password, role } = this.form;

    // Le bouton "Créer mon compte" est déjà l'action de confirmation — pas besoin
    // d'une popup "Créer votre compte ?" redondante avant d'envoyer la demande.
    // L'inscription envoie un email d'activation de façon synchrone côté serveur
    // (~4s), d'où le besoin d'un indicateur de chargement pour éviter les double-clics.
    this.inscriptionEnCours = true;
    this.authService.inscription(nom, prenom, telephone, '', null, genre, email, password, role).subscribe({
      next: data => {
        this.inscriptionEnCours = false;
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
        this.inscriptionEnCours = false;
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        const errorMessage = err.error && err.error.message ? err.error.message : 'Erreur inconnue';
        swalWithBootstrapButtons.fire(
          "",
          `<h1 style='font-size: 1em !important; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
          "error"
        );
      }
    });
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
        this.form.adresse = '',
        this.form.specialite = "Choisir",
        this.form.genre = "Choisir",
        this.form.email = '',
        this.form.confirmPassword = '',
        this.form.roles = "Choisir"

    })
  }

}
