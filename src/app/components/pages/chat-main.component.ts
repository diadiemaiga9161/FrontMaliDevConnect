import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { MessageService } from 'src/app/services/messages-chat/message.service';
import { WebsocketService as WebSocketService } from 'src/app/services/websocket.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { CryptoService } from 'src/app/services/crypto/crypto.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-chat',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  currentUser: any = null;
  conversations: any[] = [];
  selectedConversation: any = null;
  otherUser: any = null;

  messages: any[] = [];
  decryptedMessages: string[] = [];
  messageText: string = '';
  editingMessageId: number | null = null;
  editingText: string = '';

  loadingConversations: boolean = true;
  loadingMessages: boolean = false;
  loadingUsers: boolean = false;
  sendingMessage: boolean = false;
  cryptoReady: boolean = false;
  private pendingToken: string | null = null;

  searchUsers: any[] = [];
  searchText: string = '';
  showUserSearch: boolean = false;

  isMobileView: boolean = false;

  private destroy$ = new Subject<void>();
  scrollToBottom = true;
  showScrollBtn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private webSocketService: WebSocketService,
    private storageService: StorageService,
    public cryptoService: CryptoService
  ) {
    this.checkMobileView();
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();

    if (!this.currentUser) {
      Swal.fire('Erreur', 'Vous devez être connecté', 'error');
      this.router.navigate(['/connexion']);
      return;
    }

    this.connectWebSocket();

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const token = params['token'];
        if (token) {
          this.pendingToken = token;
          if (!this.loadingConversations) {
            this.resolveTokenAndSelect(token);
            this.pendingToken = null;
          }
        }
      });

    this.loadConversations();
    window.addEventListener('resize', () => this.checkMobileView());
  }

  checkMobileView(): void {
    this.isMobileView = window.innerWidth < 768;
  }

  connectWebSocket(): void {
    this.webSocketService.connect()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.webSocketService.getMessagesPrives()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message: any) => {
          const senderId = message.expediteur?.id || message.senderId;
          if (senderId && senderId === this.otherUser?.id) {
            this.messages.push(message);
            this.scrollToBottom = true;
          }
          this.loadConversations();
        },
        error: (error) => console.error('WebSocket error:', error)
      });
  }

  loadConversations(): void {
    this.loadingConversations = true;
    this.messageService.getConversations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.conversations = data || [];
          this.loadingConversations = false;
          if (this.pendingToken) {
            this.resolveTokenAndSelect(this.pendingToken);
            this.pendingToken = null;
          }
        },
        error: () => { this.loadingConversations = false; }
      });
  }

  resolveTokenAndSelect(token: string): void {
    // Chercher d'abord dans les conversations existantes
    const conv = this.conversations.find(c => {
      const u = c.contact || c.user || c.otherUser;
      return u?.tokenPartage === token;
    });
    if (conv) {
      this.selectConversation(conv);
      return;
    }
    // Sinon résoudre le token via l'API publique
    this.userService.getProfilPublic(token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: any) => {
          if (user?.id) { this.selectionnerUtilisateur(user); }
          else { this.resoudreParId(token); }
        },
        error: () => { this.resoudreParId(token); }
      });
  }

  // Repli si le token n'est pas un tokenPartage valide (ex: profil sans lien de partage
  // généré) : on tente de l'interpréter comme un id numérique brut.
  private resoudreParId(token: string): void {
    const id = Number(token);
    if (!id || isNaN(id)) return;
    this.userService.voirProfil(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: any) => { if (user?.id) this.selectionnerUtilisateur(user); },
      error: () => {}
    });
  }

  private selectionnerUtilisateur(user: any): void {
    const existingConv = this.conversations.find(c =>
      (c.contact?.id === user.id || c.user?.id === user.id || c.otherUser?.id === user.id)
    );
    if (existingConv) {
      this.selectConversation(existingConv);
    } else {
      this.otherUser = user;
      this.selectedConversation = { contact: user };
      this.loadMessages();
    }
  }

  selectConversation(conversation: any): void {
    this.selectedConversation = conversation;
    this.otherUser = conversation.contact || conversation.otherUser || conversation.user;
    this.loadMessages();
    if (this.isMobileView) this.showUserSearch = false;
  }

  loadMessages(): void {
    if (!this.otherUser?.id) return;

    this.loadingMessages = true;
    this.messageService.getConversation(this.otherUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.messages = data || [];
          this.scrollToBottom = true;
          this.loadingMessages = false;
          this.markMessagesAsRead();
        },
        error: () => { this.loadingMessages = false; }
      });
  }

  markMessagesAsRead(): void {
    if (!this.otherUser?.id) return;
    this.messageService.markConversationAsRead(this.otherUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ error: () => {} });
  }

  sendMessage(): void {
    if (!this.messageText.trim() || !this.otherUser?.id) return;

    this.sendingMessage = true;
    const plaintext = this.messageText;
    this.messageText = '';

    this.messageService.sendMessage(this.otherUser.id, plaintext)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => {
          this.messages.push(message);
          this.scrollToBottom = true;
          this.sendingMessage = false;
          this.loadConversations();
        },
        error: () => {
          this.messageText = plaintext;
          this.sendingMessage = false;
          Swal.fire('Erreur', 'Impossible d\'envoyer le message', 'error');
        }
      });
  }

  getMessageContent(message: any): string {
    return message.contenu || message.content || '';
  }

  searchUsersByName(): void {
    if (!this.searchText.trim()) { this.searchUsers = []; return; }
    this.loadingUsers = true;
    this.userService.AfficherListeInformaticien()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          const q = this.searchText.toLowerCase();
          this.searchUsers = (users || [])
            .filter((u: any) =>
              u.id !== this.currentUser.id &&
              (u.prenom?.toLowerCase().includes(q) ||
               u.nom?.toLowerCase().includes(q) ||
               u.email?.toLowerCase().includes(q))
            ).slice(0, 10);
          this.loadingUsers = false;
        },
        error: () => { this.loadingUsers = false; }
      });
  }

  startChatWithUser(user: any): void {
    this.otherUser = user;
    this.selectedConversation = { user };
    this.messages = [];
    this.searchUsers = [];
    this.searchText = '';
    this.showUserSearch = false;
    this.loadMessages();
  }

  isMessageFromCurrentUser(message: any): boolean {
    return message.expediteur?.id === this.currentUser?.id ||
           message.sender?.id === this.currentUser?.id;
  }

  formatTime(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'À l\'instant';
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}j`;
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  generateImageUrl(imageName: string): string {
    if (!imageName) return 'assets/img/team/amadou.jpg';
    return URL_PHOTO + imageName;
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/img/team/amadou.jpg';
  }

  isOnline(email: string | undefined | null): boolean {
    return this.webSocketService.estEnLigne(email);
  }

  goToProfile(token: string, id?: number): void {
    if (token) {
      this.router.navigate(['/professionnel', token]);
    }
  }

  startEdit(message: any): void {
    this.editingMessageId = message.id;
    this.editingText = this.getMessageContent(message);
  }

  cancelEdit(): void {
    this.editingMessageId = null;
    this.editingText = '';
  }

  saveEdit(message: any): void {
    const plaintext = this.editingText.trim();
    if (!plaintext) return;
    this.messageService.editMessage(message.id, plaintext)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          message.contenu = plaintext;
          this.cancelEdit();
        },
        error: () => this.cancelEdit()
      });
  }

  deleteMessage(message: any): void {
    Swal.fire({
      title: 'Supprimer ce message ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444',
      heightAuto: false
    }).then(r => {
      if (!r.isConfirmed) return;
      this.messageService.deleteMessage(message.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messages = this.messages.filter(m => m.id !== message.id);
            this.loadConversations();
          },
          error: () => {}
        });
    });
  }

  ngAfterViewChecked(): void {
    if (this.scrollToBottom) {
      this.scrollToBottomOfMessages();
      this.scrollToBottom = false;
    }
  }

  onMessagesScroll(): void {
    const el = this.messagesContainer?.nativeElement;
    if (!el) return;
    this.showScrollBtn = el.scrollHeight - el.scrollTop - el.clientHeight > 120;
  }

  scrollToBottomManual(): void {
    this.scrollToBottomOfMessages();
  }

  private scrollToBottomOfMessages(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
        this.showScrollBtn = false;
      }
    } catch (_) {}
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
