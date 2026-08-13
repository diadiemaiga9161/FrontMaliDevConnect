import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {
  etat: 'chargement' | 'succes' | 'erreur' = 'chargement';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'] || '';
    if (!token) {
      this.etat = 'erreur';
      this.message = 'Lien d\'activation invalide : aucun jeton fourni.';
      return;
    }

    this.authService.activateAccount(token).subscribe({
      next: (res: any) => {
        this.etat = 'succes';
        this.message = (typeof res === 'string' && res) || 'Compte activé avec succès.';
      },
      error: (err) => {
        this.etat = 'erreur';
        this.message = (typeof err?.error === 'string' && err.error)
          || err?.error?.message
          || 'Le lien d\'activation est invalide ou a déjà été utilisé.';
      }
    });
  }
}
