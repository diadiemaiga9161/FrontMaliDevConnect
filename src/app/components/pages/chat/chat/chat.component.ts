import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagesChatService } from 'src/app/services/messages-chat/messages-chat.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';

const URL_PHOTO = environment.Url_PHOTO;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('messagesList') messagesListRef!: ElementRef;

  conversations: any[] = [];
  messagesActuels: any[] = [];
  contactActuel: any = null;
  nouveauMessage = '';
  currentUser: any;
  private wsSub?: Subscription;
  private needsScroll = false;
  showScrollBtn = false;

  constructor(
    private chatService: MessagesChatService,
    private wsService: WebsocketService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.chargerConversations();

    this.wsService.connect();
    this.wsSub = this.wsService.getMessagesPrives().subscribe((msg) => {
      if (this.contactActuel && (msg.expediteur?.id === this.contactActuel.id || msg.destinataire?.id === this.contactActuel.id)) {
        this.messagesActuels.push(msg);
        this.needsScroll = true;
      }
      this.chargerConversations();
    });
  }

  ngAfterViewChecked(): void {
    if (this.needsScroll) {
      this.scrollToBottom();
      this.needsScroll = false;
    }
  }

  scrollToBottom(): void {
    try {
      const el = this.messagesListRef?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch (_) {}
  }

  onScroll(): void {
    const el = this.messagesListRef?.nativeElement;
    if (!el) return;
    this.showScrollBtn = el.scrollHeight - el.scrollTop - el.clientHeight > 120;
  }

  chargerConversations(): void {
    this.chatService.getConversations().subscribe({
      next: (data) => { this.conversations = data; },
      error: () => {}
    });
  }

  ouvrirConversation(conversation: any): void {
    const contact = conversation?.contact || conversation;
    if (!contact?.id) return;
    this.contactActuel = contact;

    this.chatService.getConversation(contact.id).subscribe({
      next: (msgs) => {
        this.messagesActuels = msgs || [];
        this.needsScroll = true;
        this.chatService.marquerConversationCommeLue(contact.id).subscribe(() => {
          if (conversation?.contact) conversation.nonLus = 0;
        });
      },
      error: () => {}
    });
  }

  getContent(msg: any): string {
    return msg.contenu || msg.content || '';
  }

  envoyerMessage(): void {
    const contenu = this.nouveauMessage.trim();
    if (!contenu || !this.contactActuel) return;

    this.chatService.envoyerMessage(this.contactActuel.id, contenu).subscribe({
      next: (msg) => {
        this.messagesActuels.push(msg);
        this.nouveauMessage = '';
        this.needsScroll = true;
        this.chargerConversations();
      },
      error: () => {}
    });
  }

  getPhoto(user: any): string {
    if (user?.utilisateurPhoto?.nom) return URL_PHOTO + user.utilisateurPhoto.nom;
    if (user?.photos?.[0]?.nom) return URL_PHOTO + user.photos[0].nom;
    return 'assets/img/team/amadou.jpg';
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/img/team/amadou.jpg';
  }

  getNom(user: any): string {
    return `${user?.prenom || ''} ${user?.nom || ''}`.trim() || user?.email || 'Contact';
  }

  getMessageDate(message: any): Date | null {
    return message?.dateEnvoi || message?.dateCreation || null;
  }

  estMon(msg: any): boolean {
    return msg.expediteur?.id === this.currentUser?.id;
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }
}
