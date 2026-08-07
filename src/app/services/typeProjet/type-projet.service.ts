import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const URL_BASE: string = environment.Url_BASE;  // Définit l'URL de base pour les requêtes API à partir de l'environnement

@Injectable({
  providedIn: 'root'
})
export class TypeProjetService {

  constructor(
    private http: HttpClient,  // Injection du service HttpClient pour effectuer des requêtes HTTP
    private storageService: StorageService,  // Injection du service de stockage local
  ) { }

  ajouterTypeProjet(typeProjet: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(URL_BASE + 'typeProjet/ajouter', typeProjet, { headers });
  }

  AfficherListeTypeProjet(): Observable<any> {
    return this.http.get(`${URL_BASE}typeprojet/afficher`, { headers: this.getHeaders() });
  }

  modifierTypeProjet(id: number, data: any): Observable<any> {
    return this.http.put(`${URL_BASE}typeProjet/modifier/${id}`, data, { headers: this.getHeaders() });
  }

  supprimerTypeProjet(id: number): Observable<any> {
    return this.http.delete(`${URL_BASE}typeProjet/supprimer/${id}`, { headers: this.getHeaders() });
  }

  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;  // Obtient le jeton d'accès à partir du service de stockage local
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Crée et retourne les en-têtes HTTP avec le jeton d'accès
    });
  }

}
