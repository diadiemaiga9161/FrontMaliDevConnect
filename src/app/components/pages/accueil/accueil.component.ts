import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  User: any;
  informaticien: any;
  p:number=1
  searchTextSpecialite: any;
  searchTextConnaissance: any;
  searchText : any;
  specialite: any;
  profileImageUrl: string = ''; // Variable pour stocker le chemin de l'image de profil
  connaissance: any;
  nombreprojet: number = 0;
  
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
    private serviceUser: UserService,
    private specialiteService: SpecialiteService,
    private connaissanceService: ConnaissanceService,
    public router: Router,
  ) { }
  
  

  

  ngOnInit(): void {
    // AFFICHER LA LISTE DES INFORMATICIENS
    this.serviceUser.AfficherListeInformaticien().subscribe(data => {
      this.informaticien = data;
      console.log(this.informaticien);
    });
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
  }

  goToDettailInformaticien(id: number | undefined): Promise<boolean> {
    if (id !== undefined) {
      return this.router.navigate(['profil-détaillé', id]);
    }
    // Gérer le cas où id est indéfini (facultatif)
    return Promise.resolve(false); // Retourner une promesse résolue avec `false` (ou une autre valeur appropriée)
  }

}
