import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { StorageService } from './storage/storage.service';
import { environment } from 'src/environments/environment';

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

  constructor(private storageService: StorageService) {}

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
      const email = user.email;

      // Messages privés
      this.stompClient?.subscribe(`/user/${email}/queue/messages`, (msg: Message) => {
        this.messagesPrives.next(JSON.parse(msg.body));
      });

      // Notifications
      this.stompClient?.subscribe(`/user/${email}/queue/notifications`, (msg: Message) => {
        this.notifications.next(JSON.parse(msg.body));
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
}
