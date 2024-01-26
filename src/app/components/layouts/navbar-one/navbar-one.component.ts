import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';



const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-navbar-one',
  templateUrl: './navbar-one.component.html',
  styleUrls: ['./navbar-one.component.scss']
})
export class NavbarOneComponent implements OnInit {

  isLoggedIn = false;
  isLoginFailed = true;
  errorMessage = '';
  User: any
  profileImageUrl: string = '';


  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.User = this.storageService.getUser();
    console.log(this.User);
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }
    // Chargez l'image de profil actuelle depuis User.user.photo (si disponible)
    if (this.User && this.User.photos[0]) {
      this.profileImageUrl = this.generateImageUrl(this.User.photos[0]?.nom);
    }
  }

  classApplied = false;
  toggleClass() {
    this.classApplied = !this.classApplied;
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }


  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/tiec.jpg';
  }

  //METHODE PERMETTANT DE SE DECONNECTER
  logout(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de vous déconnecter?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: res => {
            // console.log(res);
            this.storageService.clean();
            this.router.navigateByUrl("/");
            if (this.storageService.isLoggedIn()) {
              this.isLoggedIn = true;
            } else if (!this.storageService.isLoggedIn()) {
              this.isLoginFailed = false;
            }
          },
          error: err => {
            // console.log(err);
          }
        });
      }
    })

  }
}
