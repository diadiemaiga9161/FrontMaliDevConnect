import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UserService } from 'src/app/services/user/user.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ChatModalService } from 'src/app/services/chat-modal/chat-modal.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';



const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-navbar-one',
  templateUrl: './navbar-one.component.html',
  styleUrls: ['./navbar-one.component.scss']
})
export class NavbarOneComponent implements OnInit, OnDestroy {

  notificationCount: number = 0;
  rdv: any[] = [];
  isLoggedIn = false;
  isLoginFailed = true;
  errorMessage = '';
  User: any;
  profileImageUrl: string = '';
  sidebarservice: any;
  private wsSub: Subscription;
  private userSub: Subscription;
  private countSub: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private userService: UserService,
    private notificationService: NotificationService,
    private wsService: WebsocketService,
    private chatModalService: ChatModalService
  ) {}

  openChat(): void {
    this.chatModalService.open();
  }

  ngOnInit(): void {
    this.User = this.storageService.getUser();
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      // S'abonner au compteur partagé → se met à jour automatiquement depuis n'importe quelle page
      this.countSub = this.notificationService.count$.subscribe(count => {
        this.notificationCount = count;
      });
      this.notificationService.refreshCount();

      this.wsService.connect();
      this.wsSub = this.wsService.getNotifications().subscribe(() => {
        this.notificationService.increment();
      });

      // Le user en localStorage peut être obsolète (photo/logo changé depuis, ou
      // synchronisé côté backend après coup) → on rafraîchit une fois au chargement
      // pour que le nav affiche toujours la photo à jour sans nécessiter une reconnexion.
      this.userService.AfficherInfoUserConnecte().subscribe({
        next: (data) => {
          if (!data) return;
          const stored = this.storageService.getUser();
          this.storageService.setUser({ ...stored, ...data });
        },
        error: () => {}
      });
    }

    const initPhotoNom = this.User?.utilisateurPhoto?.nom || this.User?.photos?.[0]?.nom;
    if (initPhotoNom) {
      this.profileImageUrl = this.generateImageUrl(initPhotoNom);
    }

    this.userSub = this.storageService.userChanged$.subscribe((user) => {
      this.User = user || {};
      this.isLoggedIn = !!user;
      const photoNom = user?.utilisateurPhoto?.nom || user?.photos?.[0]?.nom;
      if (photoNom) {
        this.profileImageUrl = this.generateImageUrl(photoNom);
      } else {
        this.profileImageUrl = '';
      }
      if (this.isLoggedIn) {
        this.chargerCountNotifications();
      }
    });
  }

  chargerCountNotifications(): void {
    this.notificationService.refreshCount();
  }

  resetNotificationCount(): void {
    this.notificationService.setCount(0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.countSub?.unsubscribe();
  }

 

  classApplied = false;
  toggleClass() {
    this.classApplied = !this.classApplied;
  }

  generateImageUrl(photoFileName: string): string {
    if (!photoFileName) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    const path = photoFileName.startsWith('/') ? photoFileName : '/' + photoFileName;
    return base + path;
  }


  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/amadou.jpg';
  }

  //METHODE PERMETTANT DE SE DECONNECTER
  logout(): void {
    Swal.fire({
      text: "Etes-vous sûre de vous déconnecter?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#086AD8',
      cancelButtonColor: '#ef3544',
      reverseButtons: true,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.storageService.clean();
        this.isLoggedIn = false;
        this.router.navigateByUrl("/");
        this.authService.logout().subscribe({ error: () => {} });
      }
    });
  }


  
    // goToProfilUserOrInfo
    goToProfilUserOrInfo() {
      this.User = this.storageService.getUser();
      this.notificationCount = 0; // Réinitialiser le compteur de notifications
      if (this.User && this.User.roles) {
          if (this.User.roles.includes('ROLE_ENTREPRISE')) {
            this.router.navigate(["/entreprise/dashboard"]);
          } else if (this.User.roles.includes('ROLE_PROFESSIONNEL')) {
            this.router.navigate(["/profil-professionnel"]);
          } else {
            this.router.navigate(["/profil-client"]);

          }
      }

    }
    toggleSidebar() {
      this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }
  
  getSideBarState() {
      return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
      this.sidebarservice.setSidebarState(true);
  }
  
}






