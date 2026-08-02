import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-type-rdv',
  templateUrl: './type-rdv.component.html',
  styleUrls: ['./type-rdv.component.scss']
})
export class TypeRdvComponent implements OnInit {
  items: any[] = [];
  filtered: any[] = [];
  loading = true;
  search = '';
  showForm = false;
  editingItem: any = null;
  form = { typerdv: '' };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getTypeRdvs().subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    const q = this.search.toLowerCase();
    this.filtered = q ? this.items.filter(i => i.typerdv?.toLowerCase().includes(q)) : [...this.items];
  }

  openAdd(): void { this.editingItem = null; this.form = { typerdv: '' }; this.showForm = true; }
  openEdit(item: any): void { this.editingItem = item; this.form = { typerdv: item.typerdv }; this.showForm = true; }
  cancelForm(): void { this.showForm = false; this.editingItem = null; }

  sauvegarder(): void {
    if (!this.form.typerdv.trim()) return;
    const obs = this.editingItem
      ? this.adminService.modifierTypeRdv(this.editingItem.id, this.form)
      : this.adminService.ajouterTypeRdv(this.form);

    obs.subscribe({
      next: () => {
        Swal.fire({ title: 'Enregistré !', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false });
        this.cancelForm(); this.load();
      },
      error: err => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  supprimer(item: any): void {
    Swal.fire({
      title: `Supprimer "${item.typerdv}" ?`, icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Supprimer', cancelButtonText: 'Annuler', heightAuto: false
    }).then(r => {
      if (!r.isConfirmed) return;
      this.adminService.supprimerTypeRdv(item.id).subscribe({
        next: () => { this.load(); Swal.fire({ title: 'Supprimé', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false }); },
        error: err => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
      });
    });
  }
}
