import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccueilComponent } from './components/pages/accueil/accueil.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { ProfilesDetailsComponent } from './components/pages/profiles-details/profiles-details.component';
import { BlogGridComponent } from './components/pages/blog-grid/blog-grid.component';
import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './components/pages/terms-conditions/terms-conditions.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { PricingComponent } from './components/pages/pricing/pricing.component';
import { TeamComponent } from './components/pages/team/team.component';
import { ProjectsDetailsComponent } from './components/pages/projects-details/projects-details.component';
import { InformaticienComponent } from './components/pages/Informaticien(e)/Informaticien.component';
import { ProjectsOneComponent } from './components/pages/projects-one/projects-one.component';
import { ServicesDetailsComponent } from './components/pages/services-details/services-details.component';
import { AproposComponent } from './components/pages/apropos/apropos.component';
import { ProfilUserComponent } from './components/pages/profil-user/profil-user.component';
import { ProfilDevComponent } from './components/pages/profil-dev/profil-dev.component';
import { EditProfileUserComponent } from './components/pages/edit-profile-user/edit-profile-user.component';
import { EditProfileDevComponent } from './components/pages/edit-profile-dev/edit-profile-dev.component';
import { ConnexionComponent } from './components/pages/connexion/connexion.component';
import { ProfilesComponent } from './components/pages/profiles/profiles.component';
import {CompleteProfilsComponent } from './components/pages/complete-profils/complete-profils.component';

const routes: Routes = [
    {path: '', component: AccueilComponent},

  
    {path: 'services-details', component: ServicesDetailsComponent},
    {path: 'projects-one', component: ProjectsOneComponent},
    {path: 'informaticien', component: InformaticienComponent},
    {path: 'projects-details', component: ProjectsDetailsComponent},
    {path: 'equipe', component: TeamComponent},
    {path: 'pricing', component: PricingComponent},    // {path: 'connexion', component: ConnexionComponent},
    {path: 'inscription', component: SignUpComponent},
    {path: 'connexion', component: ConnexionComponent},
    {path: 'condition', component: TermsConditionsComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {path: 'error', component: ErrorComponent},
    {path: 'coming-soon', component: ComingSoonComponent},
    {path: 'blog-grid', component: BlogGridComponent},
    {path: 'profiles-details', component: ProfilesDetailsComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'profile-utuliateur', component: ProfilUserComponent},
    {path: 'profile-dev', component: ProfilDevComponent},
    {path: 'edit-profile-user', component: EditProfileUserComponent},
    {path: 'edit-profile-dev', component: EditProfileDevComponent},
    {path: 'profiles', component: ProfilesComponent},
    {path: 'apropos', component: AproposComponent},
    {path: 'complete-profils', component: CompleteProfilsComponent},
    // Here add new pages component

    {path: '**', component: ErrorComponent} // This line will remain down from the whole pages component list
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}