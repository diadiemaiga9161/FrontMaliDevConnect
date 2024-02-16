import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import  { RdvService } from 'src/app/services/rendezVous/rendezVous.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TyperdvService } from 'src/app/services/typerdv/typerdv.service';
import Swal from 'sweetalert2';


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
  profileImageUrl: string = ''; // Variable pour stocker le chemin de l'image de profil
User: any;
errorMessage: any = '';
  isSuccess: any = false;
  isError: any = false;
  isLoggedIn = false;
  isLoginFailed = true;
  type: any;


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
    private route: ActivatedRoute,
    private serviceUser: UserService,
    private serviceTypeRdv: TyperdvService,
    private storageService: StorageService,
    private rdvService: RdvService 
  ) { }
  

  ngOnInit(): void {
    //RECUPERER L'ID DE L'INFORMATICIEN
    this.id = +this.route.snapshot.params["id"]

     // AFFICHER LA LISTE DES INFORMATICIENS
     this.serviceTypeRdv.AfficherListeTyperdv().subscribe(data => {
      this.type = data;
      console.log(this.type);
    });


    //AFFICHER UN INFORMATICIEN EN FONCTION DE SON ID
    this.serviceUser.AfficherInformaticienParId(this.id).subscribe(data => {
      this.informaticien = data;
      this.specialite = data?.specialite;
      this.projet = data?.projetInformatiques;
      console.log(this.informaticien);
    });
  }

  RdvForm: any = {
    objet: null,
    dateRendezvous: null,
    heureRendezvous: null,
    typeRendezVousId: null,
    userRecu: null
  }

  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.selectedTab === tab;
  }
  
  //METHODE PERMETTANT DE PRENDRE UN RENDEZ-VOUS
  PrendreRvd(): void {
    this.id = this.route.snapshot.params["id"]
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service serviceUser
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode PrendreRdv() avec le contenu et l'ID
      this.rdvService.PrendreRdv(this.RdvForm.objet,
         this.RdvForm.dateRendezvous, this.RdvForm.heureRendezvous,
         this.id,
         this.RdvForm.typeRendezVousId).subscribe({
        next: (data) => {
          if(data.status)
          {
            let timerInterval = 2000;
                  Swal.fire({
                    position: 'center',
                    text: data.message,
                    title: "Prise de rendez-vous envoyer",
                    icon: 'success',
                    heightAuto: false,
                    showConfirmButton: false,
                    confirmButtonColor: '#0857b5',
                    showDenyButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    timer: timerInterval,
                    timerProgressBar: true,
                  }).then(() => {
                    this.RdvForm.objet = "";
                    this.RdvForm.dateRendezvous = "";
                    this.RdvForm.heureRendezvous= "";
                    this.RdvForm.typeRendezVousId= "";
                  });
          }else{
            Swal.fire({
              position: 'center',
              text: data.message,
              title: 'Erreur',
              icon: 'error',
              heightAuto: false,
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#0857b5',
              showDenyButton: false,
              showCancelButton: false,
              allowOutsideClick: false,
            }).then((result) => { });
          }
          // console.log("Rendez-vous envoyé avec succès:", data);
          this.isSuccess = true;
          this.errorMessage = 'Rendez-vous envoyé avec succès';
          // this.RdvForm.date= null;
          // this.RdvForm.heure = null;
        },
        error: (err) => {
          // console.error("Erreur lors de l'envoi du rdv :", err);
          this.errorMessage = err.error.message;
          this.isError = true
          // Gérez les erreurs ici
          if (this.RdvForm.dateRendezvous == null || this.RdvForm.heureRendezvous == null) {
            this.errorMessage = 'Date et heure de rendez-vous sont obligatoire'
          }
        }
      }
      );
    } else {
      // console.error("Token JWT manquant");
    }
  }

}
