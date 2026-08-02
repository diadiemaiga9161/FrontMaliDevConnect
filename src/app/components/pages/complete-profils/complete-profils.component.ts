import { Component, EventEmitter, Injectable, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { ExperienceService } from 'src/app/services/experience/experience.service';
import { ProjetService } from 'src/app/services/projet/projet.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

const URL_PHOTO: string = environment.Url_PHOTO;
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-complete-profils',
  templateUrl: './complete-profils.component.html',
  styleUrls: ['./complete-profils.component.scss']
})
export class CompleteProfilsComponent implements OnInit {

  titreExperience: string;
  dateDebutExperience: Date;
  dateFinExperience: Date;
  lieuExperience: string;
  titreProjet: string;
  descriptionProjet: string;
  photoProjet: string; 
  User: any;
  searchTextSpecialite: any;
  searchTextConnaissance: any;
  connaissance: any;
  step: number = 1;

  




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
    private authService: AuthService,
    private serviceUser: UserService,
    private connaissanceService: ConnaissanceService,
    private experienceService: ExperienceService,
    private projetService: ProjetService,
    public router: Router,
  ) { }

  

  ngOnInit(): void {

    this.serviceUser.AfficherInfoUserConnecte().subscribe(data => {
      this.User = data;
      console.log(this.User);
  }
  );
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
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }
  @ViewChild('form') form: NgForm;



  formData: any = {};
  next(): void {
    this.step++;
  }

  previous(): void {
    this.step--;
  }

  submit(): void {
    // Appelez les méthodes pour soumettre l'expérience professionnelle, le projet et les connaissances
    this.submitExperience();
    this.submitProjet();
    this.submitConnaissance();
  }
  

  submitConnaissance(): void {
    // Code pour soumettre les connaissances sélectionnées
    console.log('Connaissance sélectionnée :', this.connaissance);
    // Passez à l'étape suivante
    this.next();
  }
  

  submitExperience(): void {
    // Soumettez les détails de l'expérience professionnelle au service utilisateur
    const experience = {
      titre: this.titreExperience,
      dateDebut: this.dateDebutExperience,
      dateFin: this.dateFinExperience,
      lieu: this.lieuExperience
    };
    // Appelez votre service pour ajouter l'expérience
    this.experienceService.ajouterexperienceProfessionnelle(experience).subscribe(response => {
      console.log('Expérience ajoutée avec succès!', response);
    });
  }
  submitProjet(): void {
    // Soumettez les détails du projet au service utilisateur
    const projet = {
      titre: this.titreProjet,
      description: this.descriptionProjet,
      photo: this.photoProjet
    };
    // Appelez votre service pour ajouter le projet
    this.projetService.ajouterProjetinformatique(projet).subscribe(response => {
      console.log('Projet ajouté avec succès!', response);
    });
  }

  // goToDettailProfessionnel(id: number | undefined): Promise<boolean> {
  //   if (id !== undefined) {
  //     return this.router.navigate(['profil-détaillé', id]);
  //   }
  //   return Promise.resolve(false);
  // }

  

  
}
