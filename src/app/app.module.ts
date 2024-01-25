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
import { ServicesDetailsComponent } from './components/pages/services-details/services-details.component';
import { ProjectsOneComponent } from './components/pages/projects-one/projects-one.component';
import { InformaticienComponent } from './components/pages/Informaticien(e)/Informaticien.component';
import { ProjectsDetailsComponent } from './components/pages/projects-details/projects-details.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { BlogGridComponent } from './components/pages/blog-grid/blog-grid.component';
import { ProfilesDetailsComponent } from './components/pages/profiles-details/profiles-details.component';
import { PricingComponent } from './components/pages/pricing/pricing.component';
import { TeamComponent } from './components/pages/team/team.component';
import { TermsConditionsComponent } from './components/pages/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
import { ProfilUserComponent } from './components/pages/profil-user/profil-user.component';
import { ProfilDevComponent } from './components/pages/profil-dev/profil-dev.component';
import { EditProfileDevComponent } from './components/pages/edit-profile-dev/edit-profile-dev.component';
import { EditProfileUserComponent } from './components/pages/edit-profile-user/edit-profile-user.component';
import { ProfilesComponent } from './components/pages/profiles/profiles.component';
import { CompleteProfilsComponent } from './components/pages/complete-profils/complete-profils.component';
import { FormsModule } from '@angular/forms';
import { ConnexionComponent } from './components/pages/connexion/connexion.component';

@NgModule({
  declarations: [
    AppComponent,
    AproposComponent,
    PreloaderComponent,
    FooterComponent,
    AccueilComponent,
    NavbarOneComponent,
    NavbarTwoComponent,
    ServicesDetailsComponent,
    ProjectsOneComponent,
    InformaticienComponent,
    ProjectsDetailsComponent,
    ContactComponent,
    BlogGridComponent,
    ProfilesComponent,
    PricingComponent,
    TeamComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    ErrorComponent,
    SignUpComponent,
    ComingSoonComponent,
    ProfilUserComponent,
    ProfilDevComponent,
    EditProfileDevComponent,
    EditProfileUserComponent,
    ProfilesComponent,
    ConnexionComponent,
    ProfilesDetailsComponent,
    CompleteProfilsComponent,

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
