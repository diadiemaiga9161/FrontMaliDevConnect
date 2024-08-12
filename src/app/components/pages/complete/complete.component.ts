import { Component, Injectable, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { ExperienceService } from 'src/app/services/experience/experience.service';
import { ProjetService } from 'src/app/services/projet/projet.service';
import { TypeConnaissanceService } from 'src/app/services/type-connaissance/type-connaissance.service';
import { TypeProjetService } from 'src/app/services/typeProjet/type-projet.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';


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
    public router: Router,
  ) {

  }
  form: any = {
    titre: null,
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
    idinf: null
  };


  form2: any = {
    connaissance: null,
    idinf: null
  };


  ngOnInit(): void {

    this.serviceUser.AfficherInfoUserConnecte().subscribe(data => {
      this.User = data;
      console.log(this.User);
    }
    );


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
      this.typeConnaissanceService = data;
      console.log(this.typeConnaissanceService);
    });
    // AFFICHER LA LISTE DES CONNAISSANCES
    this.connaissanceService.AfficherListeConnaissance().subscribe(data => {
      this.connaissance = data;
      console.log(this.connaissance);
    });

  }


  goToDettailInformaticien(id: number | undefined): Promise<boolean> {
    if (id !== undefined) {
      return this.router.navigate(['profil-détaillé', id]);
    }
    // Gérer le cas où id est indéfini (facultatif)
    return Promise.resolve(false); // Retourner une promesse résolue avec `false` (ou une autre valeur appropriée)
  }


  submitForm() {
    this.experienceService.Ajouterexperience(this.form.titre, this.form.datedebut, this.form.datefin, this.form.lieux, this.form.idinf).subscribe((data) => {
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
  } 
  // submitForm1(form1:NgForm) {
    
  //   console.log(form1.value)
  //   }

  // submitForm1() {
  //   this.projetService.ajouter(this.form1.titre, this.form1.description, this.form1.typeProjet, this.form1.photo).subscribe(
  //     response => {
  //       console.log(response);
  //       // Gérez la réponse ici
  //     },
  //     error => {
  //       console.error(error);
  //       // Gérez l'erreur ici
  //     }
  //   );
  // }

  submitForm2() {
    this.connaissanceService.Ajouter(this.form.nom,).subscribe((data) => {
      // Enregistrez les données de l'utilisateur dans le service de stockage (session storage ou autre)
      console.log(data);
      console.log(this.informaticien.id);
    });
  }
}
