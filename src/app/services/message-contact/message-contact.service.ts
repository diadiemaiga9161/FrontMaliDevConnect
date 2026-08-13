import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE;

// Envoi public depuis la page Contact. Boîte de réception admin dans admin.service.ts.
@Injectable({ providedIn: 'root' })
export class MessageContactService {

  constructor(private http: HttpClient) {}

  envoyer(nom: string, email: string, message: string): Observable<any> {
    return this.http.post(`${URL_BASE}messages-contact/envoyer`, { nom, email, message });
  }
}
