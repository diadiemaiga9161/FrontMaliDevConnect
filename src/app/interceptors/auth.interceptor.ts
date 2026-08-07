import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage/storage.service';

// Endpoints publics : aucun token Bearer envoyé (accès anonyme, pas d'auth requise)
const PUBLIC_URLS = [
  '/auth/signin', '/auth/signup', '/auth/forgotPassword', '/auth/resetPassword',
  '/profil/public/',
  // Projet-détaillé : endpoints publics, pas besoin de token
  '/projetInformatique/projetparid/',
  '/projetInformatique/par-type/',
  // Profil public
  '/user/byRole/', '/user/plus-vus', '/user/userparid/', '/user/profil/', '/user/specialites/',
  '/projetInformatique/par-user/', '/projetInformatique/afficher',
  '/amadou/par-user/', '/connaissance/par-user/', '/biographie/par-user/',
  '/commentaires/profil/', '/connaissance/toutes',
  // Chat token + clé publique E2E (publics)
  '/user/chat-token/', '/user/public-key/',
];

// Ces endpoints nécessitent l'auth mais ne doivent PAS déclencher une déconnexion en cas de 401
// (chargement initial, WebSocket, erreurs transitoires)
const SKIP_LOGOUT_ON_401 = [
  // Clé publique E2E — tâche de fond, ne pas déconnecter si elle échoue
  '/user/public-key',
  // RDV
  '/rdv/rdvNonNotifies',
  '/rdv/get',
  // Profil professionnel — chargement initial
  '/connaissance/afficher',
  '/contact/mes-contacts',
  '/contact/demandes-recues',
  '/contact/demandes-envoyees',
  '/favoris',
  '/amadou/voir',
  '/projetInformatique/voir',
  // Chat
  '/messages/conversations',
  '/messages/conversation',
  '/messages/non-lus/count',
  '/messages/envoyer',
  '/messages/lire',
  '/messages/modifier',
  '/messages/supprimer',
  // Notifications
  '/notifications',
  // Commentaires
  '/commentaires/ajouter',
  '/commentaires/voir',
  '/commentaires/recus',
  '/commentaires/envoyes',
  // Contact — vérification de statut sur profil public (peut retourner 401 si token expiré)
  '/contact/verifier',
  '/contact/demandes-recues',
  '/contact/demandes-envoyees',
];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private storageService: StorageService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isPublic = PUBLIC_URLS.some(url => req.url.includes(url));

    if (!isPublic) {
      const token = this.storageService.getUser()?.token;
      if (token) {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.storageService.isLoggedIn()) {
          const isNonCritical = SKIP_LOGOUT_ON_401.some(url => req.url.includes(url));
          if (!isNonCritical) {
            this.storageService.clean();
            this.router.navigate(['/connexion']);
          }
        }
        return throwError(error);
      })
    );
  }
}
