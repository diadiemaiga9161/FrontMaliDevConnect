import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-messages-contact',
  templateUrl: './messages-contact.component.html',
  styleUrls: ['./messages-contact.component.scss']
})
export class MessagesContactComponent implements OnInit {
  items: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getMessagesContactTous().subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get nonLus(): number {
    return this.items.filter(m => !m.lu).length;
  }

  marquerLu(item: any): void {
    if (item.lu) return;
    this.adminService.marquerMessageContactLu(item.id).subscribe({
      next: () => { item.lu = true; },
      error: () => {}
    });
  }

  supprimer(item: any): void {
    Swal.fire({
      title: `Supprimer le message de "${item.nom}" ?`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Supprimer', cancelButtonText: 'Annuler', heightAuto: false
    }).then(r => {
      if (!r.isConfirmed) return;
      this.adminService.supprimerMessageContact(item.id).subscribe({
        next: () => { this.load(); Swal.fire({ title: 'Supprimé', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false }); },
        error: err => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
      });
    });
  }
}
