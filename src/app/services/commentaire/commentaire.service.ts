import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE + 'commentaires/';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  // ===== HEADERS AVEC TOKEN =====
  private getHeaders(): HttpHeaders {
    const user = this.storageService.getUser();
    const token = user?.token;

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  }

  // ===== AJOUTER =====
  ajouterCommentaire(contenu: string, idDestinataire: number): Observable<any> {
    const body = new URLSearchParams();
    body.set('contenu', contenu);
    body.set('idDestinataire', idDestinataire.toString());

    return this.http.post(
      `${URL_BASE}ajouter`,
      body.toString(),
      { headers: this.getHeaders() }
    );
  }

  // ===== COMMENTAIRES RECUS =====
  getMesCommentairesRecus(): Observable<any> {
    return this.http.get(
      `${URL_BASE}recus`,
      { headers: this.getHeaders() }
    );
  }

  // ===== COMMENTAIRES ENVOYES =====
  getMesCommentairesEnvoyes(): Observable<any> {
    return this.http.get(
      `${URL_BASE}envoyes`,
      { headers: this.getHeaders() }
    );
  }

  // ===== STATISTIQUES =====
  getStatistiques(): Observable<any> {
    return this.http.get(
      `${URL_BASE}statistiques`,
      { headers: this.getHeaders() }
    );
  }

  // ===== MODIFIER =====
  modifierCommentaire(id: number, contenu: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('contenu', contenu);

    return this.http.put(
      `${URL_BASE}modifier/${id}`,
      body.toString(),
      { headers: this.getHeaders() }
    );
  }

  // ===== SUPPRIMER =====
  supprimerCommentaire(id: number): Observable<any> {
    return this.http.delete(
      `${URL_BASE}supprimer/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // ===== DETAIL =====
  getCommentaireById(id: number): Observable<any> {
    return this.http.get(
      `${URL_BASE}${id}`,
      { headers: this.getHeaders() }
    );
  }

  // ===== ADMIN =====
  adminAfficherTous(): Observable<any> {
    return this.http.get(
      `${URL_BASE}admin/tous`,
      { headers: this.getHeaders() }
    );
  }

  // ===== COMMENTAIRES D'UN PROFIL (PUBLIC) =====
  getCommentairesDuProfil(userId: number): Observable<any> {
    return this.http.get(`${URL_BASE}profil/${userId}`);
  }

  // ===== COMPATIBILITE =====
  Commentaire(commentaires: string, userRecu: any): Observable<any> {
    const idDestinataire = typeof userRecu === 'object' ? userRecu.id : userRecu;
    return this.ajouterCommentaire(commentaires, idDestinataire);
  }

  AfficherListeCommentaire(): Observable<any> {
    return this.adminAfficherTous();
  }
}