import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact/contact.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  onglet: 'contacts' | 'recues' | 'envoyees' = 'contacts';
  mesContacts: any[] = [];
  demandesRecues: any[] = [];
  demandesEnvoyees: any[] = [];
  loading = true;
  searchTerm = '';

  private destroy$ = new Subject<void>();

  constructor(
    private contactService: ContactService,
    private storageService: StorageService,
    private wsService: WebsocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerTout();
    this.wsService.connect().pipe(takeUntil(this.destroy$)).subscribe();
    this.wsService.getNotifications().pipe(takeUntil(this.destroy$)).subscribe((notif: any) => {
      if (notif?.type === 'ACCEPTATION_CONTACT' || notif?.type === 'DEMANDE_CONTACT') {
        this.chargerTout();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  chargerTout(): void {
    this.loading = true;
    this.contactService.getMesContacts().subscribe({
      next: (data) => { this.mesContacts = Array.isArray(data) ? data : []; this.loading = false; },
      error: () => { this.mesContacts = []; this.loading = false; }
    });
    this.contactService.getDemandesRecues().subscribe({
      next: (data) => { this.demandesRecues = Array.isArray(data) ? data : []; },
      error: () => { this.demandesRecues = []; }
    });
    this.contactService.getDemandesEnvoyees().subscribe({
      next: (data) => { this.demandesEnvoyees = Array.isArray(data) ? data : []; },
      error: () => { this.demandesEnvoyees = []; }
    });
  }

  accepterDemande(id: number): void {
    this.contactService.accepterDemande(id).subscribe({
      next: () => {
        Swal.fire({ title: 'Contact accepté !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        this.chargerTout();
      },
      error: (err) => {
        Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible d\'accepter.', icon: 'error', heightAuto: false });
      }
    });
  }

  refuserDemande(id: number): void {
    Swal.fire({
      title: 'Refuser la demande ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, refuser',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444',
      heightAuto: false
    }).then((r) => {
      if (r.isConfirmed) {
        this.contactService.refuserDemande(id).subscribe({
          next: () => {
            Swal.fire({ title: 'Demande refusée', icon: 'info', timer: 1500, showConfirmButton: false, heightAuto: false });
            this.chargerTout();
          },
          error: () => {}
        });
      }
    });
  }

  voirProfil(token: string): void {
    if (token) this.router.navigate(['/professionnel', token]);
  }

  envoyerMessage(userId: number): void {
    this.router.navigate(['/chat', userId]);
  }

  generateImageUrl(nom: string): string {
    if (!nom) return 'assets/img/team/amadou.jpg';
    const base = URL_PHOTO.replace(/\/$/, '');
    const path = nom.startsWith('/') ? nom : '/' + nom;
    return base + path;
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/img/team/amadou.jpg';
  }

  isOnline(email: string | undefined | null): boolean {
    return this.wsService.estEnLigne(email);
  }

  get contactsFiltres(): any[] {
    if (!this.searchTerm.trim()) return this.mesContacts;
    const term = this.searchTerm.toLowerCase();
    return this.mesContacts.filter(c => {
      const u = c.contact || c.expediteur || c.recepteur || c;
      return (u.nom || '').toLowerCase().includes(term) ||
             (u.prenom || '').toLowerCase().includes(term) ||
             (u.specialite?.specialite || '').toLowerCase().includes(term);
    });
  }

  extractUser(contact: any, myId: number): any {
    if (contact.contact) return contact.contact;
    if (contact.expediteur?.id === myId) return contact.recepteur;
    if (contact.recepteur?.id === myId) return contact.expediteur;
    return contact.expediteur || contact.recepteur || contact;
  }

  get myId(): number {
    return this.storageService.getUser()?.id;
  }
}
