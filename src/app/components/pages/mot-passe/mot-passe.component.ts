import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mot-passe',
  templateUrl: './mot-passe.component.html',
  styleUrls: ['./mot-passe.component.scss']
})
export class MotPasseComponent implements OnInit {
  email: string = '';
  loading: boolean = false;

  constructor(
    private authservice: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  resetPassword(email: string): void {
    if (!email || !email.trim()) {
      Swal.fire('Champ requis', 'Veuillez saisir votre adresse email.', 'warning');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire('Email invalide', 'Veuillez saisir une adresse email valide.', 'warning');
      return;
    }

    this.loading = true;
    this.authservice.forgotPassword(email).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Email envoyé !',
          html: `Un lien de réinitialisation a été envoyé à <strong>${email}</strong>.<br>Vérifiez votre boîte mail (et les spams).`,
          confirmButtonText: 'OK'
        }).then(() => this.router.navigate(['/connexion']));
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Aucun compte trouvé avec cet email.';
        Swal.fire('Erreur', msg, 'error');
      }
    });
  }
}
