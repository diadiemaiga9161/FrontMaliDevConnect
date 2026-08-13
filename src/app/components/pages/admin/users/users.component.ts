import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filtered: any[] = [];
  loading = true;
  search = '';
  filterRole = 'tous';
  filterRoles = ['tous', 'professionnel', 'entreprise', 'client', 'admin'];

  // Détail utilisateur
  showDetail = false;
  detailUser: any = null;
  loadingDetail = false;

  // Modal création
  showCreateModal = false;
  creating = false;
  createForm = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    role: 'client'
  };
  createError = '';

  readonly URL_PHOTO = environment.Url_PHOTO;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.adminService.getTousUtilisateurs().subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? data : [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    let list = [...this.users];
    if (this.filterRole !== 'tous') {
      list = list.filter(u => (u.roles || []).some((r: string) => r.toLowerCase().includes(this.filterRole)));
    }
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      list = list.filter(u =>
        `${u.prenom} ${u.nom}`.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.telephone?.toLowerCase().includes(q)
      );
    }
    this.filtered = list;
  }

  getRoleLabel(user: any): string {
    const roles: string[] = user.roles || [];
    if (roles.includes('ROLE_SUPERADMIN')) return 'superadmin';
    if (roles.includes('ROLE_ADMIN')) return 'admin';
    if (roles.includes('ROLE_PROFESSIONNEL')) return 'pro';
    if (roles.includes('ROLE_ENTREPRISE')) return 'entreprise';
    return 'client';
  }

  getProfilUrl(user: any): string[] | null {
    if (!user.tokenPartage) return null;
    return this.getRoleLabel(user) === 'entreprise' ? ['/entreprise', user.tokenPartage] : ['/professionnel', user.tokenPartage];
  }

  isBanned(user: any): boolean {
    return user.etat === false || user.banni === true;
  }

  getPhotoUrl(user: any): string {
    const nom = user?.utilisateurPhoto?.nom || user?.photos?.[0]?.nom;
    if (!nom) return 'assets/img/team/amadou.jpg';
    return this.URL_PHOTO.replace(/\/$/, '') + '/' + nom;
  }

  handleImgError(e: any): void {
    e.target.src = 'assets/img/team/amadou.jpg';
  }

  // ── Détail ──────────────────────────────────────────────────
  openDetail(user: any): void {
    this.showDetail = true;
    this.detailUser = user;
    this.loadingDetail = true;
    this.adminService.getUserDetail(user.id).subscribe({
      next: (data) => { this.detailUser = data; this.loadingDetail = false; },
      error: () => { this.loadingDetail = false; }
    });
  }

  closeDetail(): void {
    this.showDetail = false;
    this.detailUser = null;
  }

  // ── Création ────────────────────────────────────────────────
  openCreateModal(): void {
    this.createForm = { prenom: '', nom: '', email: '', telephone: '', password: '', role: 'client' };
    this.createError = '';
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.createError = '';
  }

  submitCreate(): void {
    if (!this.createForm.prenom || !this.createForm.nom || !this.createForm.email || !this.createForm.password) {
      this.createError = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    this.creating = true;
    this.createError = '';

    const roleMap: Record<string, string> = {
      'client': 'ROLE_CLIENT',
      'professionnel': 'ROLE_PROFESSIONNEL',
      'entreprise': 'ROLE_ENTREPRISE',
      'admin': 'ROLE_ADMIN'
    };

    const payload = {
      prenom: this.createForm.prenom,
      nom: this.createForm.nom,
      email: this.createForm.email,
      telephone: this.createForm.telephone,
      password: this.createForm.password,
      role: [roleMap[this.createForm.role] || 'ROLE_CLIENT']
    };

    this.adminService.creerUser(payload).subscribe({
      next: () => {
        this.creating = false;
        this.showCreateModal = false;
        Swal.fire({ title: 'Utilisateur créé !', icon: 'success', timer: 1800, showConfirmButton: false, heightAuto: false });
        this.load();
      },
      error: (err) => {
        this.creating = false;
        this.createError = err?.error?.message || 'Erreur lors de la création.';
      }
    });
  }

  // ── Ban / Unban ──────────────────────────────────────────────
  banUser(user: any): void {
    Swal.fire({
      title: `Bannir ${user.prenom} ${user.nom} ?`,
      text: 'Cet utilisateur ne pourra plus se connecter.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, bannir',
      cancelButtonText: 'Annuler',
      heightAuto: false
    }).then(r => {
      if (!r.isConfirmed) return;
      this.adminService.banUser(user.id).subscribe({
        next: () => {
          user.etat = false;
          Swal.fire({ title: 'Utilisateur banni', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        },
        error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible de bannir', icon: 'error', heightAuto: false })
      });
    });
  }

  debanUser(user: any): void {
    this.adminService.debanUser(user.id).subscribe({
      next: () => {
        user.etat = true;
        Swal.fire({ title: 'Accès rétabli', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
      },
      error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
    });
  }

  validerProfil(user: any): void {
    Swal.fire({
      title: `Valider le profil de ${user.prenom} ?`,
      text: 'Ce professionnel sera marqué comme vérifié.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
      heightAuto: false
    }).then(r => {
      if (!r.isConfirmed) return;
      this.adminService.validerProfil(user.id).subscribe({
        next: () => {
          user.verfication = true;
          Swal.fire({ title: 'Profil validé !', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        },
        error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
      });
    });
  }

  supprimerUser(user: any): void {
    Swal.fire({
      title: `Supprimer ${user.prenom} ${user.nom} ?`,
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      heightAuto: false
    }).then(r => {
      if (!r.isConfirmed) return;
      this.adminService.supprimerUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.applyFilter();
          Swal.fire({ title: 'Supprimé', icon: 'success', timer: 1500, showConfirmButton: false, heightAuto: false });
        },
        error: (err) => Swal.fire({ title: 'Erreur', text: err?.error?.message, icon: 'error', heightAuto: false })
      });
    });
  }
}
