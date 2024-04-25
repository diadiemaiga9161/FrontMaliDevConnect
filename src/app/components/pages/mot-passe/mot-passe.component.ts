import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-mot-passe',
  templateUrl: './mot-passe.component.html',
  styleUrls: ['./mot-passe.component.scss']
})
export class MotPasseComponent implements OnInit {
email: any;

   constructor(private authservice: AuthService) { } // Injection du service dans le constructeur

  ngOnInit(): void {
  }

  // Méthode pour déclencher la demande de réinitialisation du mot de passe
  resetPassword(email: string) {
    this.authservice.forgotPassword(email).subscribe(
      response => {
        // Gérer la réponse de la requête si nécessaire
        console.log(response);
      },
      error => {
        // Gérer les erreurs de la requête si nécessaire
        console.error(error);
      }
    );
  }
}
