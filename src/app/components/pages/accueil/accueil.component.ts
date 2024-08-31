import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { ProjetService } from 'src/app/services/projet/projet.service'

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  User: any;
  informaticien: any;
  searchText : any;
  specialite: any;
  profileImageUrl: string = ''; // Variable pour stocker le chemin de l'image de profil
  connaissance: any;
  // nombreDeClient: number = 0;

  nombreinformaticiens: number = 0;
  http: any;
  nombreDeProjets: number= 0;
  nombreDeClient:number= 0;
  nombreInformaticiens: number= 0;
  
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
    private specialiteService: SpecialiteService,
    private connaissanceService: ConnaissanceService,
    private projetService: ProjetService,
    public router: Router,
  ) { }
  
  

  

  ngOnInit(): void {
  // AFFICHER LA LISTE DES INFORMATICIENS ET COMPTER LE NOMBRE
 this.serviceUser.AfficherListeInformaticien().subscribe(data => {
  this.informaticien = data.reverse();
  this.nombreInformaticiens = this.informaticien.length; // Compte le nombre d'informaticiens
  console.log('Nombre d\'informaticiens:', this.nombreInformaticiens);
});

this.projetService.AfficherListeProjetInformatique().subscribe(data => {
  this.nombreDeProjets = data.length;  // Obtenir le nombre total de projets
  console.log('Nombre de projets:', this.nombreDeProjets);
});

   // th
     // AFFICHER LA LISTE DES INFORMATICIENS
     this.specialiteService.AfficherListeSPecialite().subscribe(data => {
      this.specialite = data;
      console.log(this.specialite);
    });
    // AFFICHER LA LISTE DES CONNAISSANCES
    this.connaissanceService.AfficherListeConnaissance().subscribe(data => {
      this.connaissance = data;
      console.log(this.connaissance);
    });    
    
//nombre de client 
this.serviceUser.AfficherListeClient().subscribe(data => {
  this.nombreDeClient = data.length; // Compte le nombre de clients
  console.log('Nombre de clients:', this.nombreDeClient);
});

   //nombre informaticien 
//    this.serviceUser.AfficherListeInformaticien().subscribe(data => {
//     this.nombreInformaticiens = data;
//    console.log(this.nombreInformaticiens);
//  });
    // this.projetService.AfficherListeProjetInformatique().subscribe(
    //   (nombre: number) => {
    //     this.nombreDeProjets = nombre;
    //   },
    //   (erreur) => {
    //     console.error('Erreur lors de la récupération du nombre de projets', erreur);
    //   }
    // );
  }
  getHeaders(): any {
    throw new Error('Method not implemented.');
  }

  goToDettailInformaticien(id: number | undefined): Promise<boolean> {
    if (id !== undefined) {
      return this.router.navigate(['profil-détaillé', id]);
    }
    // Gérer le cas où id est indéfini (facultatif)
    return Promise.resolve(false); // Retourner une promesse résolue avec `false` (ou une autre valeur appropriée)
  }
  

  
}
function AfficherListeProjetInformatique() {
  throw new Error('Function not implemented.');
}

