import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccueilComponent } from './components/pages/accueil/accueil.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { ProfilesDetailsComponent } from './components/pages/profiles-details/profiles-details.component';
import { BlogGridComponent } from './components/pages/blog-grid/blog-grid.component';
import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { PricingComponent } from './components/pages/pricing/pricing.component';
import { ProfilUtilisateurComponent } from './components/pages/profil-utilisateur/profil-utilisateur.component';
import { InformaticienComponent } from './components/pages/Informaticien(e)/Informaticien.component';
import { AproposComponent } from './components/pages/apropos/apropos.component';
import { ProfilDevComponent } from './components/pages/profil-dev/profil-dev.component';
import { ConnexionComponent } from './components/pages/connexion/connexion.component';
import { RdvDetailsComponent } from './components/pages/rdv-details/rdv-details.component';
import { profilInformaticienComponent } from './components/pages/profil-informaticien/profil-informaticien.component';
import {CompleteProfilsComponent } from './components/pages/complete-profils/complete-profils.component';

const routes: Routes = [
    {path: '', component: AccueilComponent},

  
  
    {path: 'informaticien', component: InformaticienComponent},
    {path: 'profil-client', component: ProfilUtilisateurComponent}, 
    {path: 'pricing', component: PricingComponent},    // {path: 'connexion', component: ConnexionComponent},
    {path: 'inscription', component: SignUpComponent},
    {path: 'connexion', component: ConnexionComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {path: 'error', component: ErrorComponent},
    {path: 'coming-soon', component: ComingSoonComponent},
    {path: 'blog-grid', component: BlogGridComponent},
    {path: 'profiles-details', component: ProfilesDetailsComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'profile-dev/:id', component: ProfilDevComponent},
    {path: 'profil-informaticien', component: profilInformaticienComponent},
    {path: 'apropos', component: AproposComponent},
    {path: 'rdv-details', component: RdvDetailsComponent},
    {path: 'complete-profils', component: CompleteProfilsComponent},
    // Here add new pages component

    {path: '**', component: ErrorComponent} // This line will remain down from the whole pages component list
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}