import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class MessagesChatService {

  constructor(private http: HttpClient) {}

  envoyerMessage(idDestinataire: number, contenu: string): Observable<any> {
    const params = new HttpParams().set('contenu', contenu);
    return this.http.post(`${URL_BASE}messages/envoyer/${idDestinataire}`, null, { params });
  }

  getConversation(idAutreUser: number): Observable<any> {
    return this.http.get(`${URL_BASE}messages/conversation/${idAutreUser}`);
  }

  getConversations(): Observable<any> {
    return this.http.get(`${URL_BASE}messages/conversations`);
  }

  marquerConversationCommeLue(idAutreUser: number): Observable<any> {
    return this.http.put(`${URL_BASE}messages/lire/${idAutreUser}`, {});
  }

  countNonLus(): Observable<any> {
    return this.http.get(`${URL_BASE}messages/non-lus/count`);
  }
}
