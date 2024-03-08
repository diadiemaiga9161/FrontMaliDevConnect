import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './components/layouts/preloader/preloader.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { AccueilComponent } from './components/pages/accueil/accueil.component';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

import { NavbarOneComponent } from './components/layouts/navbar-one/navbar-one.component';
import { AproposComponent } from './components/pages/apropos/apropos.component';
import { InformaticienComponent } from './components/pages/Informaticien(e)/Informaticien.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { InscriptionComponent } from './components/pages/inscription/inscription.component';
import { MaintenanceComponent } from './components/pages/maintenance/maintenance.component';
import { ProfilDevComponent } from './components/pages/profil-dev/profil-dev.component';
import { CompleteProfilsComponent } from './components/pages/complete-profils/complete-profils.component';
import { FormsModule } from '@angular/forms';
import { ConnexionComponent } from './components/pages/connexion/connexion.component';
import { profilInformaticienComponent } from './components/pages/profil-informaticien/profil-informaticien.component';
import { ProfilUtilisateurComponent } from './components/pages/profil-utilisateur/profil-utilisateur.component';
import { RdvDetailsComponent } from './components/pages/rdv-details/rdv-details.component';
import { ProjetsDétailléComponent } from './components/pages/projets-détaillé/projets-détaillé.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PopupComponent } from './popup/popup.component';


@NgModule({
  declarations: [
    AppComponent,
    AproposComponent,
    PreloaderComponent,
    FooterComponent,
    AccueilComponent,
    NavbarOneComponent,
    InformaticienComponent,
    ContactComponent,
    RdvDetailsComponent,
    ErrorComponent,
    InscriptionComponent,
    MaintenanceComponent,
    ProfilDevComponent,
    ProfilUtilisateurComponent,
    ConnexionComponent,
    CompleteProfilsComponent,
    profilInformaticienComponent,
    ProfilUtilisateurComponent,
    RdvDetailsComponent,
    ProjetsDétailléComponent,



  ],

  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
