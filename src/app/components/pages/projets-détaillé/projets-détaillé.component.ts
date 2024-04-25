import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { ExperienceService } from 'src/app/services/experience/experience.service';
import { ProjetService } from 'src/app/services/projet/projet.service';
import { RdvService } from 'src/app/services/rendezVous/rendezVous.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TyperdvService } from 'src/app/services/typerdv/typerdv.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';


const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-projets-détaillé',
  templateUrl: './projets-détaillé.component.html',
  styleUrls: ['./projets-détaillé.component.scss']
})
export class ProjetsDétailléComponent implements OnInit {
  id: any;
  informaticien: any;
  projetInformatique: any;
  User: any;
  form: any;
  isSuccessful = false;
  isSignUpFailed = false;
  profileImageUrl: string = ''; // Variable pour stocker le chemin de l'image de profil
  errorMessage = '';
  type: any;
  projet: any;
  specialite: any;
  connaissance: any;
  experienceProfessionnelle: any;


  constructor(
    private serviceUser: UserService,
    private storageService: StorageService,
    private authService: AuthService,
    private rdvService:  RdvService,
    private specialiteService: SpecialiteService,
    private projetService: ProjetService,

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
      specialite: this.User?.specialite?.id,
      projet: this.User?.ProjetInformatique
    };
  }

  ngOnInit(): void {
       
    this.projetService.AfficherListeProjetInformatique().subscribe(data => {
      this.type = data;
      console.log(this.type);
    });

    this.serviceUser.AfficherProjetInformatiqueParId(this.projetInformatique.id).subscribe(data => {
  
      console.log(this.projetInformatique);
    });

    
    //AFFICHER UN INFORMATICIEN EN FONCTION DE SON ID
    this.serviceUser.AfficherInformaticienParId(this.id).subscribe(data => {
      this.informaticien = data;
      this.projet = data?.projetInformatiques;
      console.log(this.informaticien);
    });

    
    //AFFICHER UN INFORMATICIEN EN FONCTION DE SON ID
    this.serviceUser.AfficherInformaticienParId(this.id).subscribe(data => {
      this.informaticien = data;
      this.specialite = data?.specialite;
      this.projet = data?.projetInformatiques;
      this.connaissance = data?.connaissance;
      this.experienceProfessionnelle = this.informaticien.experienceProfessionnelles;
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
 
  reloadPage(): void {
    window.location.reload();
  }


  

}
