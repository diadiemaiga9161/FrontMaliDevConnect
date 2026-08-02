import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-passe',
  templateUrl: './new-passe.component.html',
  styleUrls: ['./new-passe.component.scss']
})
export class NewPasseComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  showPassword: boolean = false;
  showConfirm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      Swal.fire({
        icon: 'error',
        title: 'Lien invalide',
        text: 'Le lien de réinitialisation est invalide ou expiré.',
        confirmButtonText: 'OK'
      }).then(() => this.router.navigate(['/mdp-oublie']));
    }
  }

  resetPassword(): void {
    if (!this.newPassword || !this.confirmPassword) {
      Swal.fire('Champs requis', 'Veuillez remplir tous les champs.', 'warning');
      return;
    }
    if (this.newPassword.length < 6) {
      Swal.fire('Mot de passe trop court', 'Le mot de passe doit contenir au moins 6 caractères.', 'warning');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire('Mots de passe différents', 'Les deux mots de passe ne correspondent pas.', 'warning');
      return;
    }

    this.loading = true;
    this.authService.ChangerPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Mot de passe réinitialisé !',
          text: 'Votre mot de passe a été changé avec succès. Vous pouvez maintenant vous connecter.',
          confirmButtonText: 'Se connecter'
        }).then(() => this.router.navigate(['/connexion']));
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Une erreur est survenue. Le lien est peut-être expiré.';
        Swal.fire('Erreur', msg, 'error');
      }
    });
  }
}
