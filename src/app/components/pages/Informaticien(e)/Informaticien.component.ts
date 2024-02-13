import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user/user.service';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-informaticien',
  templateUrl: './Informaticien.component.html',
  styleUrls: ['./Informaticien.component.scss']
})
export class InformaticienComponent implements OnInit {

  User: any;
  informaticien: any;
  specialite: any;
  profileImageUrl: string = ''; // Variable pour stocker le chemin de l'image de profil



  
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
    public router: Router,
  ) { }

  

  ngOnInit(): void {
    // AFFICHER LA LISTE DES INFORMATICIENS
    this.serviceUser.AfficherListeInformaticien().subscribe(data => {
      this.informaticien = data;
      console.log(this.informaticien);
    });
  }

  goToDettailInformaticien(id: number | undefined): Promise<boolean> {
    if (id !== undefined) {
      return this.router.navigate(['profil-détaillé', id]);
    }
    // Gérer le cas où id est indéfini (facultatif)
    return Promise.resolve(false); // Retourner une promesse résolue avec `false` (ou une autre valeur appropriée)
  }
  
  // filterSpecialite() {
  //   const selectedSpecialite = this.searchForm.get('specialite')?.value;
  
  //   this.filteredSpecialite = this.specialite.filter(user =>
  //     (!selectedSpecialite || user.specialite === selectedSpecialite)
  //   );
  
  //   this.totalPages = Math.ceil(this.filteredSpecialite.length / this.itemsPerPage);
  // }
  

}
