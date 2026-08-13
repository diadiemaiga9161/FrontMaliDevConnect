import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.scss']
})
export class AvisComponent implements OnInit {
  items: any[] = [];
  filtered: any[] = [];
  loading = true;
  filtreStatut: 'TOUS' | 'EN_ATTENTE' | 'APPROUVE' | 'REJETE' = 'TOUS';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getAvisTous().subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    this.filtered = this.filtreStatut === 'TOUS'
      ? [...this.items]
      : this.items.filter(a => a.statut === this.filtreStatut);
  }

  changerFiltre(statut: 'TOUS' | 'EN_ATTENTE' | 'APPROUVE' | 'REJETE'): void {
    this.filtreStatut = statut;
    this.applyFilter();
  }

  compte(statut: string): number {
    return this.items.filter(a => a.statut === statut).length;
  }

  badgeClass(statut: string): string {
    if (statut === 'APPROUVE') return 'valide';
    if (statut === 'REJETE') return 'banni';
    return 'pending';
  }

  approuver(item: any): void {
    this.adminService.approuverAvis(item.id).subscribe({
      next: () => { this.load(); Swal.fire({ title: 'Avis approuvé', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false }); },
      error: err => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  rejeter(item: any): void {
    this.adminService.rejeterAvis(item.id).subscribe({
      next: () => { this.load(); Swal.fire({ title: 'Avis rejeté', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false }); },
      error: err => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  supprimer(item: any): void {
    Swal.fire({
      title: `Supprimer l'avis de "${item.nom}" ?`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Supprimer', cancelButtonText: 'Annuler', heightAuto: false
    }).then(r => {
      if (!r.isConfirmed) return;
      this.adminService.supprimerAvis(item.id).subscribe({
        next: () => { this.load(); Swal.fire({ title: 'Supprimé', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false }); },
        error: err => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
      });
    });
  }
}
