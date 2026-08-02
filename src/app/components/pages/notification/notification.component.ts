import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  notifications: any[] = [];
  loading = false;
  filtre: 'toutes' | 'non-lues' = 'toutes';
  private wsSub: Subscription;

  constructor(
    private notificationService: NotificationService,
    private wsService: WebsocketService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerNotifications();
    this.wsService.connect();
    this.wsSub = this.wsService.getNotifications().subscribe(notif => {
      this.notifications.unshift(notif);
    });
  }

  chargerNotifications(): void {
    this.loading = true;
    this.notificationService.getMesNotifications().subscribe({
      next: (data) => {
        this.notifications = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: () => { this.notifications = []; this.loading = false; }
    });
  }

  marquerCommeLu(notif: any): void {
    if (notif.lu) return;
    this.notificationService.marquerCommeLue(notif.id).subscribe(() => {
      notif.lu = true;
      this.notificationService.refreshCount(); // met à jour le badge navbar
    });
  }

  marquerToutesLues(): void {
    this.notificationService.marquerToutesCommeLues().subscribe(() => {
      this.notifications.forEach(n => n.lu = true);
      this.notificationService.setCount(0); // badge → 0 immédiatement
    });
  }

  supprimerLocalement(notif: any): void {
    this.notifications = this.notifications.filter(n => n.id !== notif.id);
  }

  naviguerSelonType(notif: any): void {
    this.marquerCommeLu(notif);
    const type: string = notif.type || '';
    if (type.includes('MESSAGE')) {
      const token = notif.emetteur?.tokenPartage;
      const lien: string = notif.lienRedirection || '';
      if (token) {
        this.router.navigate(['/chat', token]);
      } else if (lien.startsWith('/chat/')) {
        const chatId = lien.replace('/chat/', '');
        this.router.navigate(['/chat', chatId]);
      } else {
        this.router.navigate(['/chat']);
      }
    } else if (type.includes('RDV')) {
      this.router.navigate(['/rdv-details']);
    } else if (type.includes('CONTACT')) {
      this.router.navigate(['/contacts']);
    } else if (type.includes('COMMENTAIRE')) {
      this.router.navigate(['/profil-professionnel']);
    }
  }

  get notifsFiltrees(): any[] {
    if (this.filtre === 'non-lues') return this.notifications.filter(n => !n.lu);
    return this.notifications;
  }

  get nonLuesCount(): number {
    return this.notifications.filter(n => !n.lu).length;
  }

  getIconeType(type: string): string {
    if (!type) return 'fa-bell';
    if (type.includes('MESSAGE')) return 'fa-comment';
    if (type.includes('RDV')) return 'fa-calendar';
    if (type.includes('CONTACT')) return 'fa-user-plus';
    if (type.includes('COMMENTAIRE')) return 'fa-comment-dots';
    return 'fa-bell';
  }

  getCouleurType(type: string): string {
    if (!type) return '#086AD8';
    if (type.includes('MESSAGE')) return '#10b981';
    if (type.includes('ACCEPTATION')) return '#22c55e';
    if (type.includes('REFUS') || type.includes('ANNULATION')) return '#ef4444';
    if (type.includes('RDV')) return '#f59e0b';
    if (type.includes('CONTACT')) return '#8b5cf6';
    if (type.includes('COMMENTAIRE')) return '#06b6d4';
    return '#086AD8';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return 'À l\'instant';
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }
}
