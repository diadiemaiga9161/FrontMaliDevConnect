import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import { ExperienceService } from '../services/experience/experience.service';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage/storage.service';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-connaissance',
  templateUrl: './connaissance.component.html',
  styleUrls: ['./connaissance.component.scss']
})
export class ConnaissanceComponent implements OnInit {

  titre: any;
  User: any;
  datedebut: any;
  datefin: any;
  lieu: any;
  selectedInformaticienId: string;
  informaticien: any;


  constructor(
    private serviceUser: UserService,
    private storageService: StorageService,
    private authService: AuthService,
    private experienceService: ExperienceService,
    public router: Router,
  ) {}

  ngOnInit(): void {

    this.serviceUser.AfficherListeInformaticien().subscribe(data => {
      this.informaticien = data;
      console.log(this.informaticien);
    });

    this.serviceUser.AfficherInfoUserConnecte().subscribe(data => {
      this.User = data;
      console.log(this.User);
    });
  }


  form: any = {
    titre: null,
    datedebut: null,
    datefin: null,
    lieu: null,
  };

  submitForm() {
    const experienceData = {
      titre: this.form.titre,
      datedebut: this.form.datedebut,
      datefin: this.form.datefin,
      lieu: this.form.lieu,
      id_utilisateur: this.User.id
    };
  
    console.log("ExperienceData:", experienceData);
  
    this.experienceService.ajouterexperienceProfessionnelle(experienceData)
      .subscribe((response) => {
        console.log("Réponse de l'ajout d'expérience:", response);
        // Traitez la réponse du backend ici si nécessaire
      }, (error) => {
        console.error("Erreur lors de l'ajout d'expérience:", error);
        // Traitez les erreurs ici si nécessaire
      });
  }

}
