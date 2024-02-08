import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './components/layouts/preloader/preloader.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { AccueilComponent } from './components/pages/accueil/accueil.component';

import { NavbarOneComponent } from './components/layouts/navbar-one/navbar-one.component';
import { NavbarTwoComponent } from './components/layouts/navbar-two/navbar-two.component';
import { AproposComponent } from './components/pages/apropos/apropos.component';
import { InformaticienComponent } from './components/pages/Informaticien(e)/Informaticien.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { BlogGridComponent } from './components/pages/blog-grid/blog-grid.component';
import { PricingComponent } from './components/pages/pricing/pricing.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
import { ProfilDevComponent } from './components/pages/profil-dev/profil-dev.component';
import { CompleteProfilsComponent } from './components/pages/complete-profils/complete-profils.component';
import { FormsModule } from '@angular/forms';
import { ConnexionComponent } from './components/pages/connexion/connexion.component';
import { profilInformaticienComponent } from './components/pages/profil-informaticien/profil-informaticien.component';
import { ProfilUtilisateurComponent } from './components/pages/profil-utilisateur/profil-utilisateur.component';
import { RdvDetailsComponent } from './components/pages/rdv-details/rdv-details.component';


@NgModule({
  declarations: [
    AppComponent,
    AproposComponent,
    PreloaderComponent,
    FooterComponent,
    AccueilComponent,
    NavbarOneComponent,
    NavbarTwoComponent,
    InformaticienComponent,
    ContactComponent,
    BlogGridComponent,
    PricingComponent,
    RdvDetailsComponent,
    PrivacyPolicyComponent,
    ErrorComponent,
    SignUpComponent,
    ComingSoonComponent,
    ProfilDevComponent,
    ProfilUtilisateurComponent,
    ConnexionComponent,
    CompleteProfilsComponent,
    profilInformaticienComponent,
    ProfilUtilisateurComponent,
    RdvDetailsComponent,
    

  ],

  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
