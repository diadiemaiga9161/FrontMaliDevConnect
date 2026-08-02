import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { SpecialitesComponent } from './specialites/specialites.component';
import { CompetencesComponent } from './competences/competences.component';
import { TypeProjetsComponent } from './type-projets/type-projets.component';
import { TypeRdvComponent } from './type-rdv/type-rdv.component';
import { MonProfilComponent } from './mon-profil/mon-profil.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    UsersComponent,
    SpecialitesComponent,
    CompetencesComponent,
    TypeProjetsComponent,
    TypeRdvComponent,
    MonProfilComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
  ]
})
export class AdminModule {}
