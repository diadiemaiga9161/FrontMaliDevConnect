import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE;

// Avis publics sur la plateforme (page d'accueil) — distinct des commentaires
// laissés sur le profil d'un professionnel. La modération vit dans admin.service.ts.
@Injectable({ providedIn: 'root' })
export class AvisService {

  constructor(private http: HttpClient) {}

  envoyer(nom: string, email: string, message: string): Observable<any> {
    return this.http.post(`${URL_BASE}avis/envoyer`, { nom, email, message });
  }

  approuves(): Observable<any> {
    return this.http.get(`${URL_BASE}avis/approuves`);
  }
}
