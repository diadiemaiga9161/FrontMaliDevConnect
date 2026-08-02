import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-specialites',
  templateUrl: './specialites.component.html',
  styleUrls: ['./specialites.component.scss']
})
export class SpecialitesComponent implements OnInit {
  items: any[] = [];
  filtered: any[] = [];
  loading = true;
  search = '';
  showForm = false;
  editingItem: any = null;
  form = { specialite: '' };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getSpecialites().subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    const q = this.search.toLowerCase();
    this.filtered = q ? this.items.filter(i => i.specialite?.toLowerCase().includes(q)) : [...this.items];
  }

  openAdd(): void { this.editingItem = null; this.form = { specialite: '' }; this.showForm = true; }

  openEdit(item: any): void { this.editingItem = item; this.form = { specialite: item.specialite }; this.showForm = true; }

  cancelForm(): void { this.showForm = false; this.editingItem = null; }

  sauvegarder(): void {
    if (!this.form.specialite.trim()) return;
    const obs = this.editingItem
      ? this.adminService.modifierSpecialite(this.editingItem.id, this.form)
      : this.adminService.ajouterSpecialite(this.form);

    obs.subscribe({
      next: () => {
        Swal.fire({ title: 'Enregistré !', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false });
        this.cancelForm();
        this.load();
      },
      error: err => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  supprimer(item: any): void {
    Swal.fire({
      title: `Supprimer "${item.specialite}" ?`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Supprimer', cancelButtonText: 'Annuler', heightAuto: false
    }).then(r => {
      if (!r.isConfirmed) return;
      this.adminService.supprimerSpecialite(item.id).subscribe({
        next: () => { this.load(); Swal.fire({ title: 'Supprimé', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false }); },
        error: err => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
      });
    });
  }
}
