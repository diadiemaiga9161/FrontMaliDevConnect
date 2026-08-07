import { Component, OnInit } from '@angular/core';
import { environment } from "src/environments/environment";
import { TypeProjetService } from "src/app/services/typeProjet/type-projet.service";
import { UserService } from 'src/app/services/user/user.service';
import { ProjetService } from 'src/app/services/projet/projet.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { Router } from '@angular/router';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.scss']
})
export class ProjetComponent implements OnInit {
  projet: any[] = [];
  filteredProjet: any[] = [];
  searchTerm: string = '';

  typeprojet: any;

  selectedType: string = '';  // Type actuellement sélectionné

  nombreexperience: number = 0;
  id_utilisateur: any;
  rdv: any;
  p:number=1
  experienceProfessionnelle: any;
  titre: string;
  descriptionProjet: string;
  photoProjet: string;
  datedebut: any;
  datefin: any;
  lieu: string;
  description: string;
  selectedInformaticienId: string;
  constructor(
    private serviceUser: UserService,
    private projetService: ProjetService,
    private specialiteService: SpecialiteService,
    private typeProjetService: TypeProjetService,
    public router: Router,
  ) {}

  ngOnInit() {
    setTimeout(() => {
    });


    
    // AFFICHER LA LISTE DES INFORMATICIENS
    this.typeProjetService.AfficherListeTypeProjet().subscribe(data => {
      this.typeprojet = data;
      console.log(this.typeprojet);
    });


    // Récupérer les types de projets
    this.typeProjetService.AfficherListeTypeProjet().subscribe(data => {
      this.typeprojet = data;
    });               

    // Récupérer la liste des projets
    this.projetService.AfficherListeProjetInformatique().subscribe(data => {
      this.projet = data;
      this.filteredProjet = this.projet;  // Initialiser avec tous les projets
    });
         // AFFICHER LA LISTE projet par user
   this.projetService.AfficherListeProjetInformatique().subscribe(data => {
    this.projet = data;
    console.log( this.projet);
  });
  }

   // Méthode pour filtrer les projets par type
   filterByType(type: any): void {
    this.selectedType = type.typeprojet;

    if (this.selectedType) {
      // Filtrer les projets par type sélectionné
      this.filteredProjet = this.projet.filter(projet => projet.typeprojet === this.selectedType);
    } else {
      // Si aucun type sélectionné, afficher tous les projets
      this.filteredProjet = this.projet;
    }
  }

 


  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/amadou.jpg';
  }

  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return `${URL_PHOTO}${photoFileName}`;
  }


}
