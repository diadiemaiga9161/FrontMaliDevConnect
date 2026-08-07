import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RdvService } from 'src/app/services/rendezVous/rendezVous.service';
import { TyperdvService } from 'src/app/services/typerdv/typerdv.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-rdv-details',
  templateUrl: './rdv-details.component.html',
  styleUrls: ['./rdv-details.component.scss']
})
export class RdvDetailsComponent implements OnInit {

  onglet: 'recus' | 'envoyes' = 'recus';
  rdvRecus: any[] = [];
  rdvEnvoyes: any[] = [];
  typesRdv: any[] = [];
  loading = true;
  currentUser: any;

  // Filtres statut
  filtreStatut = 'TOUS';
  readonly statuts = ['TOUS', 'EN_ATTENTE', 'ACCEPTE', 'REFUSE', 'ANNULE'];

  constructor(
    private rdvService: RdvService,
    private typerdvService: TyperdvService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.chargerTout();
    this.chargerTypesRdv();
  }

  chargerTout(): void {
    this.loading = true;
    this.rdvService.AfficherRdvParRecuParUserConnecter().subscribe({
      next: (data) => { this.rdvRecus = Array.isArray(data) ? data : []; this.verifierChargement(); },
      error: () => { this.rdvRecus = []; this.verifierChargement(); }
    });
    this.rdvService.AfficherRdvParEnvoyerParUserConnecterNew().subscribe({
      next: (data) => { this.rdvEnvoyes = Array.isArray(data) ? data : []; this.verifierChargement(); },
      error: () => { this.rdvEnvoyes = []; this.verifierChargement(); }
    });
  }

  private _chargementsRestants = 2;
  verifierChargement(): void {
    this._chargementsRestants--;
    if (this._chargementsRestants <= 0) { this.loading = false; this._chargementsRestants = 2; }
  }

  chargerTypesRdv(): void {
    this.typerdvService.AfficherListeTyperdv().subscribe({
      next: (data) => { this.typesRdv = Array.isArray(data) ? data : []; },
      error: () => {}
    });
  }

  accepterRdv(rdv: any): void {
    Swal.fire({
      title: 'Accepter ce rendez-vous ?',
      text: `Avec ${rdv.userenvoyer?.prenom || ''} ${rdv.userenvoyer?.nom || ''} — ${rdv.objet || ''}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, accepter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#22c55e',
      heightAuto: false
    }).then((r) => {
      if (r.isConfirmed) {
        this.rdvService.AccepterRendezVous(rdv.id).subscribe({
          next: () => {
            Swal.fire({ title: 'RDV accepté !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
            this.chargerTout();
          },
          error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
        });
      }
    });
  }

  refuserRdv(rdv: any): void {
    Swal.fire({
      title: 'Refuser ce rendez-vous ?',
      input: 'textarea',
      inputLabel: 'Motif (optionnel)',
      inputPlaceholder: 'Expliquez votre refus...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, refuser',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444',
      heightAuto: false
    }).then((r) => {
      if (r.isConfirmed) {
        this.rdvService.RefuserRendezVous(rdv.id, r.value).subscribe({
          next: () => {
            Swal.fire({ title: 'RDV refusé', icon: 'info', timer: 1500, showConfirmButton: false, heightAuto: false });
            this.chargerTout();
          },
          error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
        });
      }
    });
  }

  annulerRdv(rdv: any): void {
    Swal.fire({
      title: 'Annuler ce rendez-vous ?',
      input: 'textarea',
      inputLabel: 'Motif (optionnel)',
      inputPlaceholder: 'Raison de l\'annulation...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non',
      confirmButtonColor: '#f59e0b',
      heightAuto: false
    }).then((r) => {
      if (r.isConfirmed) {
        this.rdvService.AnnulerRendezVous(rdv.id, r.value).subscribe({
          next: () => {
            Swal.fire({ title: 'Annulé !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
            this.chargerTout();
          },
          error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
        });
      }
    });
  }

  proposerAutreDate(rdv: any): void {
    const dateActuelle = rdv.date || rdv.dateRendezvous || '';
    const heureActuelle = rdv.heure || rdv.heureRendezvous || '';
    Swal.fire({
      title: 'Proposer une autre date',
      html: `
        <div style="text-align:left;">
          <div style="margin-bottom:12px;">
            <label style="font-weight:600;font-size:.9rem;display:block;margin-bottom:4px;">Nouvelle date</label>
            <input type="date" id="swal-date" class="swal2-input" style="width:100%;margin:0;"
              value="${dateActuelle}">
          </div>
          <div>
            <label style="font-weight:600;font-size:.9rem;display:block;margin-bottom:4px;">Nouvelle heure</label>
            <input type="time" id="swal-heure" class="swal2-input" style="width:100%;margin:0;"
              value="${heureActuelle}">
          </div>
        </div>`,
      confirmButtonText: 'Proposer',
      cancelButtonText: 'Annuler',
      showCancelButton: true,
      confirmButtonColor: '#086AD8',
      heightAuto: false,
      preConfirm: () => {
        const date = (document.getElementById('swal-date') as HTMLInputElement).value;
        const heure = (document.getElementById('swal-heure') as HTMLInputElement).value;
        if (!date || !heure) {
          Swal.showValidationMessage('Veuillez renseigner la date et l\'heure');
          return false;
        }
        return { date, heure };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.rdvService.ProposerAutreDate(rdv.id, result.value.date, result.value.heure).subscribe({
          next: () => {
            Swal.fire({ title: 'Proposition envoyée !', text: 'L\'autre partie sera notifiée.', icon: 'success', timer: 2000, showConfirmButton: false, heightAuto: false });
            this.chargerTout();
          },
          error: (err: any) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
        });
      }
    });
  }

  voirDetails(rdv: any): void {
    const statut = this.getStatutLibelle(rdv.statut);
    const couleur = this.getStatutCouleur(rdv.statut);
    let html = `<div style="text-align:left; line-height:1.8;">
      <p><strong>Objet :</strong> ${rdv.objet || '—'}</p>
      <p><strong>Date :</strong> ${rdv.dateRendezvous || rdv.date || '—'}</p>
      <p><strong>Heure :</strong> ${rdv.heureRendezvous || rdv.heure || '—'}</p>
      <p><strong>Type :</strong> ${rdv.typerdv?.typerdv || '—'}</p>
      <p><strong>Statut :</strong> <span class="badge bg-${couleur}">${statut}</span></p>
      ${rdv.motifAnnulation ? `<p><strong>Motif :</strong> ${rdv.motifAnnulation}</p>` : ''}
      ${rdv.dateAcceptation ? `<p><strong>Accepté le :</strong> ${new Date(rdv.dateAcceptation).toLocaleString('fr-FR')}</p>` : ''}
    </div>`;
    Swal.fire({ title: 'Détails du RDV', html, confirmButtonText: 'Fermer', heightAuto: false });
  }

  get rdvRecusFiltres(): any[] {
    if (this.filtreStatut === 'TOUS') return this.rdvRecus;
    return this.rdvRecus.filter(r => r.statut === this.filtreStatut);
  }

  get rdvEnvoyesFiltres(): any[] {
    if (this.filtreStatut === 'TOUS') return this.rdvEnvoyes;
    return this.rdvEnvoyes.filter(r => r.statut === this.filtreStatut);
  }

  get rdvEnAttenteRecus(): number {
    return this.rdvRecus.filter(r => r.statut === 'EN_ATTENTE').length;
  }

  getStatutLibelle(s: string): string {
    return { EN_ATTENTE: 'En attente', ACCEPTE: 'Accepté', REFUSE: 'Refusé', ANNULE: 'Annulé' }[s] || s;
  }

  getStatutCouleur(s: string): string {
    return { EN_ATTENTE: 'warning', ACCEPTE: 'success', REFUSE: 'danger', ANNULE: 'secondary' }[s] || 'dark';
  }

  generateImageUrl(nom: string): string {
    if (!nom) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    return base + (nom.startsWith('/') ? nom : '/' + nom);
  }

  handleImageError(e: any): void { e.target.src = 'assets/img/team/amadou.jpg'; }
}
