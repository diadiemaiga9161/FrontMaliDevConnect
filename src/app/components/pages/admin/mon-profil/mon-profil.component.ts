import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-mon-profil',
  templateUrl: './mon-profil.component.html',
  styleUrls: ['./mon-profil.component.scss']
})
export class MonProfilComponent implements OnInit {
  user: any = null;
  loading = false;
  saving = false;
  savingPwd = false;
  uploadingPhoto = false;
  photoPreview: string | null = null;

  form = { prenom: '', nom: '', email: '', telephone: '', adresse: '', genre: '' };
  pwdForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
  pwdError = '';

  readonly URL_PHOTO = environment.Url_PHOTO;

  constructor(
    private storageService: StorageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    if (this.user) {
      this.form = {
        prenom: this.user.prenom || '',
        nom: this.user.nom || '',
        email: this.user.email || '',
        telephone: this.user.telephone || '',
        adresse: this.user.adresse || '',
        genre: this.user.genre || ''
      };
    }
  }

  getPhotoUrl(): string {
    const nom = this.user?.utilisateurPhoto?.nom || this.user?.photos?.[0]?.nom;
    if (!nom) return 'assets/img/team/amadou.jpg';
    return this.URL_PHOTO.replace(/\/$/, '') + '/' + nom;
  }

  handleImgError(e: any): void {
    e.target.src = 'assets/img/team/amadou.jpg';
  }

  getRoleLabel(): string {
    const roles: string[] = this.user?.roles || [];
    if (roles.includes('ROLE_SUPERADMIN')) return 'Super Admin';
    if (roles.includes('ROLE_ADMIN')) return 'Administrateur';
    return 'Admin';
  }

  isProfessionnel(): boolean {
    return (this.user?.roles || []).includes('ROLE_PROFESSIONNEL');
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.photoPreview = reader.result as string; };
    reader.readAsDataURL(file);
    this.uploadingPhoto = true;
    this.userService.changerPhoto(file).subscribe({
      next: (data: any) => {
        this.uploadingPhoto = false;
        const updated = { ...this.user, utilisateurPhoto: data?.utilisateurPhoto || this.user?.utilisateurPhoto };
        this.storageService.saveUser(updated);
        this.user = updated;
        Swal.fire({ title: 'Photo mise à jour !', icon: 'success', timer: 1600, showConfirmButton: false, heightAuto: false });
      },
      error: (err: any) => {
        this.uploadingPhoto = false;
        this.photoPreview = null;
        Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible de changer la photo', icon: 'error', heightAuto: false });
      }
    });
  }

  saveProfil(): void {
    this.saving = true;
    this.userService.modifierProfilUser(
      this.form.nom,
      this.form.prenom,
      this.form.telephone,
      this.form.adresse,
      this.form.genre,
      this.form.email
    ).subscribe({
      next: () => {
        this.saving = false;
        // Mettre à jour le localStorage
        const updated = { ...this.user, ...this.form };
        this.storageService.saveUser(updated);
        this.user = updated;
        Swal.fire({ title: 'Profil mis à jour !', icon: 'success', timer: 1800, showConfirmButton: false, heightAuto: false });
      },
      error: (err) => {
        this.saving = false;
        Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible de sauvegarder', icon: 'error', heightAuto: false });
      }
    });
  }

  savePassword(): void {
    this.pwdError = '';
    if (!this.pwdForm.oldPassword || !this.pwdForm.newPassword) {
      this.pwdError = 'Veuillez remplir tous les champs.';
      return;
    }
    if (this.pwdForm.newPassword !== this.pwdForm.confirmPassword) {
      this.pwdError = 'Les mots de passe ne correspondent pas.';
      return;
    }
    if (this.pwdForm.newPassword.length < 6) {
      this.pwdError = 'Le nouveau mot de passe doit avoir au moins 6 caractères.';
      return;
    }
    this.savingPwd = true;
    this.userService.modifierMotDePasse(this.pwdForm.oldPassword, this.pwdForm.newPassword).subscribe({
      next: () => {
        this.savingPwd = false;
        this.pwdForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
        Swal.fire({ title: 'Mot de passe modifié !', icon: 'success', timer: 1800, showConfirmButton: false, heightAuto: false });
      },
      error: (err) => {
        this.savingPwd = false;
        this.pwdError = err?.error?.message || 'Mot de passe actuel incorrect.';
      }
    });
  }
}
