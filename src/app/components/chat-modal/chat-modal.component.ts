import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';
import { MessageService } from 'src/app/services/messages-chat/message.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ChatModalService } from 'src/app/services/chat-modal/chat-modal.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss']
})
export class ChatModalComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  isMinimized = false;
  hiddenRoutes = ['/chat', '/admin'];
  isHiddenRoute = false;

  currentUser: any = null;
  get isLoggedIn(): boolean { return !!this.storageService.getUser(); }

  conversations: any[] = [];
  selectedConversation: any = null;
  otherUser: any = null;
  messages: any[] = [];
  messageText = '';
  editingMessageId: number | null = null;
  editingText = '';

  loadingConversations = false;
  loadingMessages = false;
  loadingUsers = false;
  sendingMessage = false;
  scrollToBottom = false;
  showScrollBtn = false;

  searchText = '';
  searchUsers: any[] = [];
  showUserSearch = false;

  private destroy$ = new Subject<void>();

  constructor(
    private chatModalService: ChatModalService,
    private userService: UserService,
    private messageService: MessageService,
    private wsService: WebsocketService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((e: any) => {
      const url: string = e.urlAfterRedirects || e.url || '';
      this.isHiddenRoute = this.hiddenRoutes.some(r => url.startsWith(r));
      this.currentUser = this.storageService.getUser();
    });

    const url = this.router.url;
    this.isHiddenRoute = this.hiddenRoutes.some(r => url.startsWith(r));

    // Connexion WebSocket dès que l'utilisateur est connecté (pas seulement à
    // l'ouverture du widget) pour que les messages/notifications arrivent en instantané.
    if (this.isLoggedIn) { this.connectWS(); }

    this.chatModalService.open$.pipe(takeUntil(this.destroy$)).subscribe((open) => {
      this.isOpen = open;
      if (open && this.isLoggedIn && this.conversations.length === 0) {
        this.loadConversations();
      }
    });

    this.chatModalService.token$.pipe(takeUntil(this.destroy$)).subscribe(token => {
      if (token && this.isOpen) {
        this.resolveTokenAndSelect(token);
      }
    });

    this.storageService.userChanged$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUser = user;
      if (!user) { this.reset(); this.wsConnected = false; }
      else if (!this.wsConnected) { this.connectWS(); }
    });
  }

  private wsConnected = false;

  private connectWS(): void {
    if (this.wsConnected) return;
    this.wsConnected = true;
    this.wsService.connect().pipe(takeUntil(this.destroy$)).subscribe();
    this.wsService.getMessagesPrives().pipe(takeUntil(this.destroy$)).subscribe({
      next: (message: any) => {
        const senderId = message.expediteur?.id || message.senderId;
        if (senderId && senderId === this.otherUser?.id) {
          this.messages.push(message);
          this.scrollToBottom = true;
        }
        this.loadConversations();
      }
    });
  }

  // ========== PRÉSENCE EN LIGNE ==========
  isOnline(email: string | undefined | null): boolean {
    return this.wsService.estEnLigne(email);
  }

  loadConversations(): void {
    this.loadingConversations = true;
    this.messageService.getConversations().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.conversations = data || []; this.loadingConversations = false; },
      error: () => { this.loadingConversations = false; }
    });
  }

  selectConversation(conv: any): void {
    this.selectedConversation = conv;
    this.otherUser = conv.contact || conv.otherUser || conv.user || conv;
    this.loadMessages();
    this.showUserSearch = false;
  }

  loadMessages(): void {
    if (!this.otherUser?.id) return;
    this.loadingMessages = true;
    this.messageService.getConversation(this.otherUser.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.messages = data || [];
        this.scrollToBottom = true;
        this.loadingMessages = false;
        this.markAsRead();
      },
      error: () => { this.loadingMessages = false; }
    });
  }

  markAsRead(): void {
    if (!this.otherUser?.id) return;
    this.messageService.markConversationAsRead(this.otherUser.id)
      .pipe(takeUntil(this.destroy$)).subscribe({ error: () => {} });
  }

  sendMessage(): void {
    if (!this.messageText.trim() || !this.otherUser?.id) return;
    this.sendingMessage = true;
    const plaintext = this.messageText;
    this.messageText = '';
    this.messageService.sendMessage(this.otherUser.id, plaintext)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (msg) => {
          this.messages.push(msg);
          this.scrollToBottom = true;
          this.sendingMessage = false;
          this.loadConversations();
        },
        error: () => { this.messageText = plaintext; this.sendingMessage = false; }
      });
  }

  searchUsersByName(): void {
    if (!this.searchText.trim()) { this.searchUsers = []; return; }
    this.loadingUsers = true;
    this.userService.AfficherListeInformaticien().pipe(takeUntil(this.destroy$)).subscribe({
      next: (users) => {
        const q = this.searchText.toLowerCase();
        this.searchUsers = (users || [])
          .filter((u: any) => u.id !== this.currentUser?.id &&
            (u.prenom?.toLowerCase().includes(q) || u.nom?.toLowerCase().includes(q)))
          .slice(0, 8);
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

  resolveTokenAndSelect(token: string): void {
    const conv = this.conversations.find(c => {
      const u = c.contact || c.user || c.otherUser;
      return u?.tokenPartage === token;
    });
    if (conv) { this.selectConversation(conv); return; }
    this.userService.getProfilPublic(token).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: any) => {
        if (user?.id) {
          const existing = this.conversations.find(c =>
            (c.contact?.id === user.id || c.user?.id === user.id || c.otherUser?.id === user.id)
          );
          if (existing) { this.selectConversation(existing); }
          else { this.otherUser = user; this.selectedConversation = { contact: user }; this.loadMessages(); }
        }
      },
      error: () => {}
    });
  }

  startEdit(msg: any): void { this.editingMessageId = msg.id; this.editingText = msg.contenu || msg.content || ''; }
  cancelEdit(): void { this.editingMessageId = null; this.editingText = ''; }

  saveEdit(msg: any): void {
    const plain = this.editingText.trim();
    if (!plain) return;
    this.messageService.editMessage(msg.id, plain).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { msg.contenu = plain; this.cancelEdit(); },
      error: () => this.cancelEdit()
    });
  }

  deleteMessage(msg: any): void {
    Swal.fire({ title: 'Supprimer ?', icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Oui', cancelButtonText: 'Non', confirmButtonColor: '#ef4444', heightAuto: false
    }).then(r => {
      if (!r.isConfirmed) return;
      this.messageService.deleteMessage(msg.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => { this.messages = this.messages.filter(m => m.id !== msg.id); this.loadConversations(); },
        error: () => {}
      });
    });
  }

  getContent(msg: any): string {
    return msg.contenu || msg.content || '';
  }

  isFromMe(msg: any): boolean {
    return msg.expediteur?.id === this.currentUser?.id || msg.sender?.id === this.currentUser?.id;
  }

  get totalUnread(): number {
    return this.conversations.reduce((acc, c) => acc + (c.nonLus || c.unreadCount || 0), 0);
  }

  formatTime(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'À l\'instant';
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  generateImageUrl(nom: string): string {
    if (!nom) return 'assets/img/team/amadou.jpg';
    return URL_PHOTO + (nom.startsWith('/') ? nom : '/' + nom);
  }

  handleImageError(event: any): void { event.target.src = 'assets/img/team/amadou.jpg'; }

  openModal(): void {
    if (!this.isLoggedIn) { this.router.navigate(['/connexion']); return; }
    this.chatModalService.open();
  }

  closeModal(): void { this.chatModalService.close(); this.selectedConversation = null; }

  toggleMinimize(): void { this.isMinimized = !this.isMinimized; }

  goToFullPage(): void { this.router.navigate(['/chat']); }

  backToList(): void { this.selectedConversation = null; this.otherUser = null; }

  private reset(): void {
    this.conversations = [];
    this.selectedConversation = null;
    this.otherUser = null;
    this.messages = [];
    this.isOpen = false;
  }

  onMessagesScroll(): void {
    const el = this.messagesContainer?.nativeElement;
    if (!el) return;
    this.showScrollBtn = el.scrollHeight - el.scrollTop - el.clientHeight > 120;
  }

  scrollModalToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch (_) {}
  }

  ngAfterViewChecked(): void {
    if (this.scrollToBottom && this.messagesContainer) {
      try { this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight; } catch (_) {}
      this.scrollToBottom = false;
    }
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
