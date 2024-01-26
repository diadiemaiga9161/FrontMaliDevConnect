import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-profil-dev',
  templateUrl: './profil-dev.component.html',
  styleUrls: ['./profil-dev.component.scss']
})
export class ProfilDevComponent implements OnInit {


  selectedTab: string = 'profil'
  id: any;
  informaticien: any;
  specialite: any;
  projet: any;


  constructor(
    private route: ActivatedRoute,
    private serviceUser: UserService,
  ) { }

  ngOnInit(): void {
    //RECUPERER L'ID DE L'INFORMATICIEN
    this.id = +this.route.snapshot.params["id"]


    //AFFICHER UN INFORMATICIEN EN FONCTION DE SON ID
    this.serviceUser.AfficherInformaticienParId(this.id).subscribe(data => {
      this.informaticien = data;
      this.specialite = data?.specialite;
      this.projet = data?.projetInformatiques;
      console.log(this.informaticien);
    });
  }

  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/about/about3.png';
  }

  generateImageUrl(photoFileName: string): string {
    return `${URL_PHOTO}${photoFileName}`;
  }


  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.selectedTab === tab;
  }

}
