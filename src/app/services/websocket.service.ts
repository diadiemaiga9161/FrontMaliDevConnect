import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { StorageService } from './storage/storage.service';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE;

function resolveWsUrl(): string {
  if (environment.Url_WS) return environment.Url_WS;
  // Production : calcul depuis window.location
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}/ws`;
}

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private stompClient: Client | null = null;
  private isConnected = new BehaviorSubject<boolean>(false);
  private messagesPrives = new Subject<any>();
  private notifications = new Subject<any>();
  private utilisateursEnLigne = new BehaviorSubject<Set<string>>(new Set());

  constructor(private storageService: StorageService, private http: HttpClient) {}

  connect(): Observable<boolean> {
    const user = this.storageService.getUser();
    if (!user?.token) {
      return this.isConnected.asObservable();
    }

    if (this.stompClient?.active || this.stompClient?.connected) {
      return this.isConnected.asObservable();
    }

    this.stompClient = new Client({
      brokerURL: resolveWsUrl(),
      connectHeaders: { Authorization: `Bearer ${user.token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      this.isConnected.next(true);

      // Messages privés — destination "/user/**" : Spring route automatiquement vers
      // la session authentifiée courante, il ne faut PAS mettre l'email dans le chemin
      // (sinon ça ne matche jamais ce que le serveur envoie via convertAndSendToUser).
      this.stompClient?.subscribe(`/user/queue/messages`, (msg: Message) => {
        this.messagesPrives.next(JSON.parse(msg.body));
      });

      // Notifications
      this.stompClient?.subscribe(`/user/queue/notifications`, (msg: Message) => {
        this.notifications.next(JSON.parse(msg.body));
      });

      // Présence en ligne : snapshot initial (REST) + mises à jour en direct (WS)
      this.http.get<string[]>(`${URL_BASE}presence/en-ligne`).subscribe({
        next: (emails) => this.utilisateursEnLigne.next(new Set(emails)),
        error: () => {}
      });
      this.stompClient?.subscribe(`/topic/presence`, (msg: Message) => {
        const evt = JSON.parse(msg.body);
        const current = new Set(this.utilisateursEnLigne.value);
        if (evt.online) { current.add(evt.email); } else { current.delete(evt.email); }
        this.utilisateursEnLigne.next(current);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('WebSocket error:', frame.headers['message']);
    };

    this.stompClient.onDisconnect = () => {
      this.isConnected.next(false);
    };

    this.stompClient.activate();
    return this.isConnected.asObservable();
  }

  disconnect(): void {
    this.stompClient?.deactivate();
    this.isConnected.next(false);
  }

  envoyerMessagePrive(recipientEmail: string, content: string): void {
    const user = this.storageService.getUser();
    if (this.stompClient?.connected) {
      this.stompClient.publish({
        destination: '/app/chat.private',
        body: JSON.stringify({ sender: user?.email, recipient: recipientEmail, content })
      });
    }
  }

  getMessagesPrives(): Observable<any> {
    return this.messagesPrives.asObservable();
  }

  getNotifications(): Observable<any> {
    return this.notifications.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.isConnected.asObservable();
  }

  // ========== PRÉSENCE EN LIGNE ==========
  getUtilisateursEnLigne(): Observable<Set<string>> {
    return this.utilisateursEnLigne.asObservable();
  }

  estEnLigne(email: string | undefined | null): boolean {
    return !!email && this.utilisateursEnLigne.value.has(email);
  }
}
