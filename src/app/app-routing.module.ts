import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccueilComponent } from './components/pages/accueil/accueil.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { MaintenanceComponent } from './components/pages/maintenance/maintenance.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { ProjetsDétailléComponent } from './components/pages/projets-détaillé/projets-détaillé.component';
import { InscriptionComponent } from './components/pages/inscription/inscription.component';
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
    {path: 'inscription', component: InscriptionComponent},
    {path: 'connexion', component: ConnexionComponent},
    {path: 'error', component: ErrorComponent},
    {path: 'maintenance ', component: MaintenanceComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'profil-détaillé/:id', component: ProfilDevComponent},
    {path: 'profil-informaticien', component: profilInformaticienComponent},
    {path: 'apropos', component: AproposComponent},
    {path: 'projets-détaillé', component: ProjetsDétailléComponent},
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