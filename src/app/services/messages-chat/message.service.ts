import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class MessageService {

  constructor(private http: HttpClient) {}

  sendMessage(destinataireId: number, contenu: string): Observable<any> {
    const params = new HttpParams().set('contenu', contenu);
    return this.http.post(`${URL_BASE}messages/envoyer/${destinataireId}`, null, { params });
  }

  envoyerMessage(destinataireId: number, contenu: string): Observable<any> {
    const params = new HttpParams().set('contenu', contenu);
    return this.http.post(`${URL_BASE}messages/envoyer/${destinataireId}`, null, { params });
  }

  getConversation(autreUserId: number): Observable<any> {
    return this.http.get(`${URL_BASE}messages/conversation/${autreUserId}`);
  }

  getConversations(): Observable<any> {
    return this.http.get(`${URL_BASE}messages/conversations`);
  }

  markConversationAsRead(autreUserId: number): Observable<any> {
    return this.http.put(`${URL_BASE}messages/lire/${autreUserId}`, {});
  }

  editMessage(messageId: number, contenu: string): Observable<any> {
    return this.http.put(`${URL_BASE}messages/modifier/${messageId}`, null, {
      params: { contenu }
    });
  }

  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete(`${URL_BASE}messages/supprimer/${messageId}`);
  }

  marquerConversationCommeLue(autreUserId: number): Observable<any> {
    return this.http.put(`${URL_BASE}messages/lire/${autreUserId}`, {});
  }

  getUnreadCount(): Observable<any> {
    return this.http.get(`${URL_BASE}messages/non-lus/count`);
  }

  countNonLus(): Observable<any> {
    return this.http.get(`${URL_BASE}messages/non-lus/count`);
  }
}
