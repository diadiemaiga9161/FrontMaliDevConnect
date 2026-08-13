import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './components/layouts/preloader/preloader.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { AccueilComponent } from './components/pages/accueil/accueil.component';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

import { NavbarOneComponent } from './components/layouts/navbar-one/navbar-one.component';
import { AproposComponent } from './components/pages/apropos/apropos.component';
import { ProfessionnelComponent } from './components/pages/professionnel/professionnel.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { InscriptionComponent } from './components/pages/inscription/inscription.component';
import { MaintenanceComponent } from './components/pages/maintenance/maintenance.component';
import { ProfilDevComponent } from './components/pages/profil-dev/profil-dev.component';
import { CompleteProfilsComponent } from './components/pages/complete-profils/complete-profils.component';
import { FormsModule } from '@angular/forms';
import { ConnexionComponent } from './components/pages/connexion/connexion.component';
import { ProfilProfessionnelComponent } from './components/pages/profil-professionnel/profil-professionnel.component';
import { ProfilUtilisateurComponent } from './components/pages/profil-utilisateur/profil-utilisateur.component';
import { RdvDetailsComponent } from './components/pages/rdv-details/rdv-details.component';
import { ProjetsDétailléComponent } from './components/pages/projets-détaillé/projets-détaillé.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SingInComponent } from './components/pages/sing-in/sing-in.component';
import { MotPasseComponent } from './components/pages/mot-passe/mot-passe.component';
import { NewPasseComponent } from './components/pages/new-passe/new-passe.component';
import { ActivationComponent } from './components/pages/activation/activation.component';
import { CompleteComponent } from './components/pages/complete/complete.component';
import { ProjetComponent } from './components/pages/projet/projet.component';
import { NotificationComponent } from './components/pages/notification/notification.component';
import { ForumComponent } from './components/pages/forum/forum.component';
import { DirectoryComponent } from './components/pages/directory.component';
import { ChatComponent } from './components/pages/chat-main.component';
import { FavorisComponent } from './components/pages/favoris/favoris.component';
import { ContactsComponent } from './components/pages/contacts/contacts.component';
import { PlusVusComponent } from './components/pages/plus-vus/plus-vus.component';
import { ChatModalComponent } from './components/chat-modal/chat-modal.component';
import { PhoneInputComponent } from './components/shared/phone-input/phone-input.component';
import { EntrepriseDashboardComponent } from './components/pages/entreprise/entreprise-dashboard/entreprise-dashboard.component';
import { EntrepriseProfilComponent } from './components/pages/entreprise/entreprise-profil/entreprise-profil.component';
import { OffresComponent } from './components/pages/offres/offres.component';
import { OffreDetailComponent } from './components/pages/offres/offre-detail/offre-detail.component';
import { MesCandidaturesComponent } from './components/pages/mes-candidatures/mes-candidatures.component';



@NgModule({
  declarations: [
    AppComponent,
    AproposComponent,
    PreloaderComponent,
    FooterComponent,
    AccueilComponent,
    NavbarOneComponent,
    ProfessionnelComponent,
    ContactComponent,
    RdvDetailsComponent,
    ErrorComponent,
    InscriptionComponent,
    MaintenanceComponent,
    ProfilDevComponent,
    ProfilUtilisateurComponent,
    ConnexionComponent,
    CompleteProfilsComponent,
    ProfilProfessionnelComponent,
    ProjetsDétailléComponent,
    SingInComponent,
    MotPasseComponent,
    NewPasseComponent,
    ActivationComponent,
    CompleteComponent,
    ProjetComponent,
    NotificationComponent,
    ForumComponent,
    DirectoryComponent,
    ChatComponent,
    FavorisComponent,
    ContactsComponent,
    PlusVusComponent,
    ChatModalComponent,
    PhoneInputComponent,
    EntrepriseDashboardComponent,
    EntrepriseProfilComponent,
    OffresComponent,
    OffreDetailComponent,
    MesCandidaturesComponent,

  ],

  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FormsModule,
 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
