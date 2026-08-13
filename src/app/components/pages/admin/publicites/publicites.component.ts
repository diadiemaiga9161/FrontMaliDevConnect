import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-admin-publicites',
  templateUrl: './publicites.component.html',
  styleUrls: ['./publicites.component.scss']
})
export class PublicitesComponent implements OnInit {
  items: any[] = [];
  loading = true;
  showForm = false;
  enregistrement = false;
  fichierSelectionne: File | null = null;

  form = { type: 'IMAGE', titre: '', description: '', lien: '', duree: '24H' };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getPublicitesToutes().subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  generateImageUrl(nom: string | null): string {
    if (!nom) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    return base + (nom.startsWith('/') ? nom : '/' + nom);
  }

  handleImageError(event: any): void { event.target.src = 'assets/img/team/amadou.jpg'; }

  openAdd(): void {
    this.form = { type: 'IMAGE', titre: '', description: '', lien: '', duree: '24H' };
    this.fichierSelectionne = null;
    this.showForm = true;
  }

  cancelForm(): void { this.showForm = false; }

  onFichierChange(event: any): void {
    this.fichierSelectionne = event.target.files?.[0] || null;
  }

  estExpiree(pub: any): boolean {
    if (!pub.dateExpiration) return false;
    return new Date(pub.dateExpiration) < new Date();
  }


  sauvegarder(): void {
    if (!this.form.titre.trim()) {
      Swal.fire({ title: 'Erreur', text: 'Le titre est obligatoire.', icon: 'error', heightAuto: false });
      return;
    }
    if (!this.fichierSelectionne) {
      Swal.fire({ title: 'Erreur', text: 'Sélectionnez une image ou une vidéo.', icon: 'error', heightAuto: false });
      return;
    }
    this.enregistrement = true;
    this.adminService.ajouterPublicite({
      type: this.form.type,
      titre: this.form.titre.trim(),
      description: this.form.description?.trim(),
      lien: this.form.lien?.trim(),
      duree: this.form.duree,
      fichier: this.fichierSelectionne
    }).subscribe({
      next: () => {
        this.enregistrement = false;
        Swal.fire({ title: 'Publicité ajoutée', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false });
        this.cancelForm();
        this.load();
      },
      error: err => {
        this.enregistrement = false;
        Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible d\'ajouter la publicité', icon: 'error', heightAuto: false });
      }
    });
  }

  desactiver(item: any): void {
    Swal.fire({
      title: `Désactiver "${item.titre}" ?`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#f59e0b', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Désactiver', cancelButtonText: 'Annuler', heightAuto: false
    }).then(r => {
      if (!r.isConfirmed) return;
      this.adminService.desactiverPublicite(item.id).subscribe({
        next: () => { this.load(); Swal.fire({ title: 'Désactivée', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false }); },
        error: err => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
      });
    });
  }

  supprimer(item: any): void {
    Swal.fire({
      title: `Supprimer "${item.titre}" ?`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Supprimer', cancelButtonText: 'Annuler', heightAuto: false
    }).then(r => {
      if (!r.isConfirmed) return;
      this.adminService.supprimerPublicite(item.id).subscribe({
        next: () => { this.load(); Swal.fire({ title: 'Supprimée', icon: 'success', timer: 1200, showConfirmButton: false, heightAuto: false }); },
        error: err => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
      });
    });
  }
}
