import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { EntrepriseGuard } from './guards/entreprise.guard';
import { AccueilComponent } from './components/pages/accueil/accueil.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { MaintenanceComponent } from './components/pages/maintenance/maintenance.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { ProjetsDétailléComponent } from './components/pages/projets-détaillé/projets-détaillé.component';
import { InscriptionComponent } from './components/pages/inscription/inscription.component';
import { ProfilUtilisateurComponent } from './components/pages/profil-utilisateur/profil-utilisateur.component';
import { ProfessionnelComponent } from './components/pages/professionnel/professionnel.component';
import { AproposComponent } from './components/pages/apropos/apropos.component';
import { ProfilDevComponent } from './components/pages/profil-dev/profil-dev.component';
import { ConnexionComponent } from './components/pages/connexion/connexion.component';
import { RdvDetailsComponent } from './components/pages/rdv-details/rdv-details.component';
import { ProfilProfessionnelComponent } from './components/pages/profil-professionnel/profil-professionnel.component';
import {CompleteProfilsComponent } from './components/pages/complete-profils/complete-profils.component';
import { SingInComponent } from './components/pages/sing-in/sing-in.component';
import { MotPasseComponent } from './components/pages/mot-passe/mot-passe.component';
import { NewPasseComponent } from './components/pages/new-passe/new-passe.component';
import { ActivationComponent } from './components/pages/activation/activation.component';
import { CompleteComponent } from './components/pages/complete/complete.component';
import { ProjetComponent } from './components/pages/projet/projet.component';
import { ProductComponent } from './components/pages/product/product.component';
import { NotificationComponent } from './components/pages/notification/notification.component';
import { ForumComponent } from './components/pages/forum/forum.component';
// Page "Annuaire" désactivée (doublon de /professionnel) — voir routes ci-dessous
// import { DirectoryComponent } from './components/pages/directory.component';
import { ChatComponent } from './components/pages/chat-main.component';
import { FavorisComponent } from './components/pages/favoris/favoris.component';
import { ContactsComponent } from './components/pages/contacts/contacts.component';
import { PlusVusComponent } from './components/pages/plus-vus/plus-vus.component';
import { EntrepriseDashboardComponent } from './components/pages/entreprise/entreprise-dashboard/entreprise-dashboard.component';
import { EntrepriseProfilComponent } from './components/pages/entreprise/entreprise-profil/entreprise-profil.component';
import { OffresComponent } from './components/pages/offres/offres.component';
import { OffreDetailComponent } from './components/pages/offres/offre-detail/offre-detail.component';
import { MesCandidaturesComponent } from './components/pages/mes-candidatures/mes-candidatures.component';


const routes: Routes = [
    {path: '', component: AccueilComponent},

    {path: 'professionnel', component: ProfessionnelComponent},
    // Ancienne URL conservée pour compatibilité
    {path: 'informaticien', redirectTo: 'professionnel', pathMatch: 'full'},
    {path: 'profil-client', component: ProfilUtilisateurComponent, canActivate: [AuthGuard]},
    {path: 'inscription', component: InscriptionComponent},
    {path: 'connexion', component: ConnexionComponent},
    {path: 'error', component: ErrorComponent},
    {path: 'maintenance', component: MaintenanceComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'professionnel/:token', component: ProfilDevComponent},
    {path: 'profil/public/:token', component: ProfilDevComponent},
    // Ancienne URL conservée pour compatibilité
    {path: 'profil-détaillé/:id', redirectTo: 'professionnel/:id', pathMatch: 'full'},
    {path: 'profil-professionnel', component: ProfilProfessionnelComponent, canActivate: [AuthGuard]},
    {path: 'profil-informaticien', redirectTo: 'profil-professionnel', pathMatch: 'full'},
    {path: 'apropos', component: AproposComponent},
    {path: 'projets-détaillé/:id', component: ProjetsDétailléComponent},
    {path: 'rdv-details', component: RdvDetailsComponent, canActivate: [AuthGuard]},
    {path: 'details-rdv/:id', component: RdvDetailsComponent, canActivate: [AuthGuard]},
    {path: 'complete-profils', component: CompleteProfilsComponent, canActivate: [AuthGuard]},
    {path: 'sing-in', component: SingInComponent},
    {path: 'mdp-oublie', component: MotPasseComponent},
    {path: 'new-mdp', component: NewPasseComponent},
    {path: 'activation', component: ActivationComponent},
    {path: 'complete', component: CompleteComponent, canActivate: [AuthGuard]},
    {path: 'projet', component: ProjetComponent, canActivate: [AuthGuard]},
    {path: 'product', component: ProductComponent},
    {path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard]},
    {path: 'forum', component: ForumComponent},
    // Page "Annuaire" désactivée : doublon de /professionnel (gère aussi le cas sans tokenPartage
    // via un fallback sur l'id, ce que /directory ne fait pas). Gardée en commentaire pour référence.
    // {path: 'directory', component: DirectoryComponent},
    {path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
    {path: 'chat/:token', component: ChatComponent, canActivate: [AuthGuard]},
    {path: 'favoris', component: FavorisComponent, canActivate: [AuthGuard]},
    {path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard]},
    {path: 'plus-vus', component: PlusVusComponent},
    {path: 'admin', loadChildren: () => import('./components/pages/admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard]},

    // ── Entreprise / Offres d'emploi ──
    {path: 'entreprise/dashboard', component: EntrepriseDashboardComponent, canActivate: [EntrepriseGuard]},
    {path: 'entreprise/:token', component: EntrepriseProfilComponent},
    {path: 'offres', component: OffresComponent},
    {path: 'mes-candidatures', component: MesCandidaturesComponent, canActivate: [AuthGuard]},
    {path: 'offres/:id', component: OffreDetailComponent},




    
    // Here add new pages component

    {path: '**', component: ErrorComponent} // This line will remain down from the whole pages component list
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
