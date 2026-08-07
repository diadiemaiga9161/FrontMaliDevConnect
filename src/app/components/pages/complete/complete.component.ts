import { Component, Injectable, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { ExperienceService } from 'src/app/services/experience/experience.service';
import { ProjetService } from 'src/app/services/projet/projet.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TypeConnaissanceService } from 'src/app/services/type-connaissance/type-connaissance.service';
import { TypeProjetService } from 'src/app/services/typeProjet/type-projet.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


const URL_PHOTO: string = environment.Url_PHOTO;
@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {

  titre: string;
  User: any;
  public currentInformaticien = 'Choisir';
  informaticien: any;
  connaissance: any;
  typeprojet: any;
  typeConnaissances: any;
  id_typeConnaissances: any;
  specialites: any[] = [];
  profilCompleteForm: any = { specialiteId: null, genre: '', adresse: '' };
  profilComplete = false;

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }
  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/amadou.jpg';
  }
  constructor(
    private serviceUser: UserService,
    private authService: AuthService,
    private connaissanceService: ConnaissanceService,
    private experienceService: ExperienceService,
    private projetService: ProjetService,
    private typeProjetService: TypeProjetService,
    private typeConnaissanceService: TypeConnaissanceService,
    private specialiteService: SpecialiteService,
    private storageService: StorageService,
    public router: Router,
  ) {}
  form: any = {
    titre: null,
    poste: null,
    entreprise: null,
    description: null,
    datedebut: null,
    datefin: null,
    lieux: null,
    idinf: null
  };

  form1 = {
    titre: '',
    description: '',
    typeProjet: null,
    photo: null,
  };

  formData: any = {
    titre: '',
    description: '',
    typeProjet: '',
    lienProjet: '',
    photo: null,
    photosSuppl: null,
  };

  form2: any = {
    connaissance: null,
    id_typeConnaissances: null
  };

  formBio: any = { contenu: '' };
  selectedConnaissanceIds: number[] = [];
  currentStep: number = 1;


  ngOnInit(): void {
    this.serviceUser.AfficherInfoUserConnecte().subscribe(data => {
      this.User = data;
      this.profilComplete = data?.profilcompleter === true;
    });

    this.specialiteService.AfficherListeSPecialite().subscribe(data => {
      this.specialites = data;
    });

    // AFFICHER LA LISTE DES INFORMATICIENS
    this.serviceUser.AfficherListeInformaticien().subscribe(data => {
      this.informaticien = data;
      console.log(this.informaticien);
    });


    // AFFICHER LA LISTE DES INFORMATICIENS
    this.typeProjetService.AfficherListeTypeProjet().subscribe(data => {
      this.typeprojet = data;
      console.log(this.typeprojet);
    });

    // AFFICHER LA LISTE DES ttypes de connaissance 
    this.typeConnaissanceService.AfficherListeTypeConnaissance().subscribe(data => {
      this.typeConnaissances = data;
      console.log(this.typeConnaissances);
    });
    // AFFICHER LA LISTE DES CONNAISSANCES
    this.connaissanceService.AfficherListeConnaissance().subscribe(data => {
      this.connaissance = data;
      console.log(this.connaissance);
    });

  }


  goToDettailProfessionnel(id: number | undefined): Promise<boolean> {
    if (id !== undefined) {
      return this.router.navigate(['profil-détaillé', id]);
    }
    // Gérer le cas où id est indéfini (facultatif)
    return Promise.resolve(false); // Retourner une promesse résolue avec `false` (ou une autre valeur appropriée)
  }


  submitForm() {
    this.experienceService.Ajouterexperience(this.form.titre, this.form.poste, this.form.entreprise, this.form.description, this.form.datedebut, this.form.datefin, this.form.lieux, this.form.idinf).subscribe((data) => {
      // Enregistrez les données de l'utilisateur dans le service de stockage (session storage ou autre)
      console.log(data);
      console.log(this.informaticien.id);
      location.reload();
    });
  }

  submitForm1(form1:NgForm) {
    const data = new FormData()
    data.append("titre",form1.value['titre']);
    data.append("description",form1.value['description']);
    data.append("typeProjet",this.form1['typeProjet']);
    data.append("photo",form1.value['photo']);
    this.projetService.AjouterProjet(data).subscribe((data) => {
      // Enregistrez les données de l'utilisateur dans le service de stockage (session storage ou autre)
     console.log(data);
    });
    location.reload();

  } 

  onSubmit() {
    const data = new FormData();
    data.append('titre', this.formData.titre);
    data.append('description', this.formData.description || '');
    if (this.formData.lienProjet) { data.append('lienProjet', this.formData.lienProjet); }
    data.append('typeProjet', this.formData.typeProjet);
    if (this.formData.photo) { data.append('photos', this.formData.photo); }
    if (this.formData.photosSuppl) {
      Array.from(this.formData.photosSuppl as FileList).forEach((f: File) => data.append('photos', f));
    }

    this.projetService.ajouterProjet(data)
      .subscribe(response => {
        console.log('Response:', response);
        location.reload();
      }, error => {
        console.error('Error:', error);
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
        this.formData.photo = file;
    }
  }

  onPhotosSupplChange(event: any) {
    this.formData.photosSuppl = event.target.files;
  }
  submitForm2() {
    this.connaissanceService.Ajouter(this.form2.nom, this.form2.typeConnaissances).subscribe((data) => {
      console.log(data);
    });
  }

  nextStep(): void {
    if (this.currentStep < 5) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= 5) this.currentStep = step;
  }

  toggleConnaissance(id: number): void {
    const idx = this.selectedConnaissanceIds.indexOf(id);
    if (idx === -1) {
      this.selectedConnaissanceIds.push(id);
    } else {
      this.selectedConnaissanceIds.splice(idx, 1);
    }
  }

  lierConnaissances(): void {
    if (this.selectedConnaissanceIds.length === 0) return;
    this.connaissanceService.lierPlusieurs(this.selectedConnaissanceIds).subscribe({
      next: () => {
        Swal.fire({ title: 'Succès', text: 'Compétences liées à votre profil !', icon: 'success', timer: 2000, showConfirmButton: false, heightAuto: false });
        this.selectedConnaissanceIds = [];
      },
      error: (err) => {
        Swal.fire({ title: 'Erreur', text: err.error?.message || 'Erreur lors de la liaison des compétences', icon: 'error', heightAuto: false });
      }
    });
  }

  submitBiographie(): void {
    const contenu = this.formBio.contenu?.trim();
    if (!contenu || contenu.length < 10) {
      Swal.fire({ title: '', text: 'Veuillez saisir une biographie d\'au moins 10 caractères.', icon: 'warning', heightAuto: false });
      return;
    }
    this.serviceUser.ajouterBiographie(contenu).subscribe({
      next: () => {
        Swal.fire({ title: 'Succès', text: 'Biographie enregistrée !', icon: 'success', timer: 2000, showConfirmButton: false, heightAuto: false });
        this.formBio.contenu = '';
      },
      error: (err) => {
        Swal.fire({ title: 'Erreur', text: err.error?.message || 'Erreur lors de l\'enregistrement de la biographie', icon: 'error', heightAuto: false });
      }
    });
  }

  completerProfil(): void {
    if (!this.profilCompleteForm.specialiteId || !this.profilCompleteForm.genre || !this.profilCompleteForm.adresse) {
      Swal.fire('', 'Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }
    const payload = {
      specialite: { id: this.profilCompleteForm.specialiteId },
      genre: this.profilCompleteForm.genre,
      adresse: this.profilCompleteForm.adresse
    };
    this.serviceUser.completerProfil(payload).subscribe({
      next: (data) => {
        this.storageService.setUser({ ...this.storageService.getUser(), profilcompleter: true, specialite: { id: this.profilCompleteForm.specialiteId } });
        this.profilComplete = true;
        Swal.fire({ title: '', text: 'Profil complété avec succès !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false }).then(() => {
          this.nextStep();
        });
      },
      error: () => {
        Swal.fire('', 'Erreur lors de la complétion du profil.', 'error');
      }
    });
  }
}
