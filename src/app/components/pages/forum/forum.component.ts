import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForumService } from 'src/app/services/forum/forum.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  sujets: any[] = [];
  sujetSelectionne: any = null;
  loading = true;
  loadingReponses = false;
  isLoggedIn = false;
  currentUser: any = null;

  // Formulaire nouveau sujet
  nouveauSujet = { titre: '', contenu: '' };
  afficherFormSujet = false;

  // Formulaire nouvelle réponse
  nouvelleReponse = '';

  constructor(
    private forumService: ForumService,
    private storageService: StorageService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();
    this.isLoggedIn = !!(user && user.token);
    this.currentUser = user;
    this.chargerSujets();
  }

  chargerSujets(): void {
    this.loading = true;
    this.forumService.getTousSujets().subscribe({
      next: (data) => { this.sujets = Array.isArray(data) ? data : []; this.loading = false; },
      error: () => { this.sujets = []; this.loading = false; }
    });
  }

  voirSujet(id: number): void {
    this.loadingReponses = true;
    this.forumService.getSujet(id).subscribe({
      next: (data) => { this.sujetSelectionne = data; this.loadingReponses = false; },
      error: () => { this.loadingReponses = false; }
    });
  }

  retourListe(): void {
    this.sujetSelectionne = null;
    this.nouvelleReponse = '';
  }

  creerSujet(): void {
    if (!this.nouveauSujet.titre.trim() || !this.nouveauSujet.contenu.trim()) {
      Swal.fire({ title: 'Champs requis', text: 'Titre et contenu sont obligatoires.', icon: 'warning', heightAuto: false });
      return;
    }
    this.forumService.creerSujet(this.nouveauSujet.titre.trim(), this.nouveauSujet.contenu.trim()).subscribe({
      next: () => {
        Swal.fire({ title: 'Sujet créé !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        this.nouveauSujet = { titre: '', contenu: '' };
        this.afficherFormSujet = false;
        this.chargerSujets();
      },
      error: (err) => {
        Swal.fire({ title: 'Erreur', text: err.error?.message || 'Impossible de créer le sujet.', icon: 'error', heightAuto: false });
      }
    });
  }

  supprimerSujet(id: number): void {
    Swal.fire({
      title: 'Supprimer ce sujet ?', text: 'Cette action est irréversible.', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Oui', cancelButtonText: 'Non',
      confirmButtonColor: '#ef4444', heightAuto: false
    }).then((r) => {
      if (r.isConfirmed) {
        this.forumService.supprimerSujet(id).subscribe({
          next: () => { this.chargerSujets(); this.sujetSelectionne = null; },
          error: () => { Swal.fire({ title: 'Erreur', text: 'Suppression impossible.', icon: 'error', heightAuto: false }); }
        });
      }
    });
  }

  ajouterReponse(): void {
    if (!this.nouvelleReponse.trim()) return;
    this.forumService.ajouterReponse(this.sujetSelectionne.id, this.nouvelleReponse.trim()).subscribe({
      next: () => {
        this.nouvelleReponse = '';
        this.voirSujet(this.sujetSelectionne.id);
      },
      error: (err) => {
        Swal.fire({ title: 'Erreur', text: err.error?.message || 'Impossible d\'envoyer.', icon: 'error', heightAuto: false });
      }
    });
  }

  supprimerReponse(id: number): void {
    Swal.fire({
      title: 'Supprimer ?', icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Oui', cancelButtonText: 'Non',
      confirmButtonColor: '#ef4444', heightAuto: false
    }).then((r) => {
      if (r.isConfirmed) {
        this.forumService.supprimerReponse(id).subscribe({
          next: () => { this.voirSujet(this.sujetSelectionne.id); },
          error: () => {}
        });
      }
    });
  }

  formatDate(d: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  isAuteur(sujet: any): boolean {
    return this.currentUser && sujet?.auteur?.id === this.currentUser.id;
  }
}
