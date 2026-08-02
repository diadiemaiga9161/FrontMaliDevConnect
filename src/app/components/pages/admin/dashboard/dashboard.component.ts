import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = true;
  stats: any = {};

  // Fallback counts chargés séparément si /admin/stats n'existe pas encore
  nbProfessionnels = 0;
  nbClients = 0;
  nbSpecialites = 0;
  nbCompetences = 0;
  nbTypeProjets = 0;
  nbTypeRdv = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    // Essai endpoint stats centralisé
    this.adminService.getStats().subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => {
        // Fallback : charger chaque liste séparément
        this.loadFallbackStats();
      }
    });
  }

  loadFallbackStats(): void {
    this.adminService.getProfessionnels().subscribe({ next: d => this.nbProfessionnels = Array.isArray(d) ? d.length : 0 });
    this.adminService.getClients().subscribe({ next: d => this.nbClients = Array.isArray(d) ? d.length : 0 });
    this.adminService.getSpecialites().subscribe({ next: d => this.nbSpecialites = Array.isArray(d) ? d.length : 0 });
    this.adminService.getConnaissances().subscribe({ next: d => this.nbCompetences = Array.isArray(d) ? d.length : 0 });
    this.adminService.getTypeProjets().subscribe({ next: d => this.nbTypeProjets = Array.isArray(d) ? d.length : 0 });
    this.adminService.getTypeRdvs().subscribe({ next: d => { this.nbTypeRdv = Array.isArray(d) ? d.length : 0; this.loading = false; } });
  }

  get cards() {
    return [
      { label: 'Professionnels',   value: this.stats.professionnels ?? this.nbProfessionnels, icon: 'fa-user-tie',  color: '#086AD8', bg: '#eff6ff' },
      { label: 'Clients',          value: this.stats.clients        ?? this.nbClients,        icon: 'fa-users',     color: '#10b981', bg: '#ecfdf5' },
      { label: 'Spécialités',      value: this.stats.specialites    ?? this.nbSpecialites,    icon: 'fa-briefcase', color: '#f59e0b', bg: '#fffbeb' },
      { label: 'Compétences',      value: this.stats.competences    ?? this.nbCompetences,    icon: 'fa-star',      color: '#6366f1', bg: '#eef2ff' },
      { label: 'Types de Projets', value: this.stats.typeProjets    ?? this.nbTypeProjets,    icon: 'fa-folder',    color: '#ec4899', bg: '#fdf2f8' },
      { label: 'Types de RDV',     value: this.stats.typeRdv        ?? this.nbTypeRdv,        icon: 'fa-calendar',  color: '#14b8a6', bg: '#f0fdfa' },
    ];
  }
}
