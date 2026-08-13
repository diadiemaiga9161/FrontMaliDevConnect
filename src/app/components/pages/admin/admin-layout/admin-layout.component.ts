import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  admin: any;
  sidebarOpen = true;

  navItems = [
    { label: 'Tableau de bord', icon: 'fa-tachometer', route: '/admin/dashboard' },
    { label: 'Utilisateurs',    icon: 'fa-users',      route: '/admin/utilisateurs' },
    { label: 'Spécialités',     icon: 'fa-briefcase',  route: '/admin/specialites' },
    { label: 'Compétences',     icon: 'fa-star',       route: '/admin/competences' },
    { label: 'Types de Projets',icon: 'fa-folder',     route: '/admin/type-projets' },
    { label: 'Types de RDV',    icon: 'fa-calendar',   route: '/admin/type-rdv' },
    { label: 'Avis',            icon: 'fa-comment-o',  route: '/admin/avis' },
    { label: 'Publicités',      icon: 'fa-bullhorn',   route: '/admin/publicites' },
    { label: 'Messages',        icon: 'fa-envelope',   route: '/admin/messages-contact' },
    { label: 'Mon Profil',      icon: 'fa-user-circle',route: '/admin/mon-profil' },
  ];

  constructor(private storageService: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.admin = this.storageService.getUser();
  }

  getMonProfilRoute(): string {
    const roles: string[] = this.admin?.roles || [];
    if (roles.includes('ROLE_PROFESSIONNEL')) return '/profil-professionnel';
    return '/profil-client';
  }

  logout(): void {
    this.storageService.clean();
    this.router.navigate(['/connexion']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
