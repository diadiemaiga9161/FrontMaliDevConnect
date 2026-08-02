import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class ForumService {

  constructor(private http: HttpClient) {}

  // Sujets
  creerSujet(titre: string, contenu: string): Observable<any> {
    const body = new HttpParams().set('titre', titre).set('contenu', contenu);
    return this.http.post(`${URL_BASE}forum/sujets/creer`, body);
  }

  getTousSujets(): Observable<any> {
    return this.http.get(`${URL_BASE}forum/sujets`);
  }

  getSujet(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}forum/sujets/${id}`);
  }

  modifierSujet(id: number, titre: string, contenu: string): Observable<any> {
    const body = new HttpParams().set('titre', titre).set('contenu', contenu);
    return this.http.put(`${URL_BASE}forum/sujets/modifier/${id}`, body);
  }

  supprimerSujet(id: number): Observable<any> {
    return this.http.delete(`${URL_BASE}forum/sujets/supprimer/${id}`);
  }

  // Réponses
  ajouterReponse(sujetId: number, contenu: string): Observable<any> {
    const body = new HttpParams().set('contenu', contenu);
    return this.http.post(`${URL_BASE}forum/reponses/ajouter/${sujetId}`, body);
  }

  modifierReponse(id: number, contenu: string): Observable<any> {
    const body = new HttpParams().set('contenu', contenu);
    return this.http.put(`${URL_BASE}forum/reponses/modifier/${id}`, body);
  }

  supprimerReponse(id: number): Observable<any> {
    return this.http.delete(`${URL_BASE}forum/reponses/supprimer/${id}`);
  }
}
