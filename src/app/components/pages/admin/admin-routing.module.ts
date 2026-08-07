import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { SpecialitesComponent } from './specialites/specialites.component';
import { CompetencesComponent } from './competences/competences.component';
import { TypeProjetsComponent } from './type-projets/type-projets.component';
import { TypeRdvComponent } from './type-rdv/type-rdv.component';
import { MonProfilComponent } from './mon-profil/mon-profil.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'utilisateurs', component: UsersComponent },
      { path: 'specialites', component: SpecialitesComponent },
      { path: 'competences', component: CompetencesComponent },
      { path: 'type-projets', component: TypeProjetsComponent },
      { path: 'type-rdv', component: TypeRdvComponent },
      { path: 'mon-profil', component: MonProfilComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
