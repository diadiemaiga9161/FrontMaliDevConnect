import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

// Définition de l'URL de base pour les requêtes API
const URL_BASE: string = environment.Url_BASE;  // Définit l'URL de base pour les requêtes API à partir de l'environnement

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private accessToken!: string; // Variable pour stocker le jeton d'accès

  // Constructeur du service avec injection des dépendances nécessaires
  constructor(
    private http: HttpClient,  // Injection du service HttpClient pour effectuer des requêtes HTTP
    private storageService: StorageService,  // Injection du service de stockage local
  ) { }

  // Méthode pour définir le jeton d'accès
  setAccessToken(token: string) {
    this.accessToken = token;  // Affecte la valeur du jeton d'accès reçu à la variable privée accessToken
  }

  // Méthode pour obtenir les en-têtes avec le token JWT
  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser()?.token;
    if (!token) {
      return new HttpHeaders();
    }
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }


  // Méthode d'ajouter des experience
  ajouterexperienceProfessionnelle(experience: any): Observable<any> {
    return this.http.post(`${URL_BASE}amadou/ajouter`, experience);
  }
  
Ajouterexperience(titre: any, poste: any, entreprise: any, description: any, datedebut: any, datefin: any, lieux: any, id_utilisateur: any): Observable<any> {
  const headers = this.getHeaders();
  const data = {
    "titre"       : titre,
    "poste"       : poste,
    "entreprise"  : entreprise,
    "description" : description,
    "datedebut"   : datedebut,
    "datefin"     : datefin,
    "lieux"       : lieux,
    "id_utilisateur": id_utilisateur
  };
  return this.http.post(URL_BASE + 'amadou/ajouter', data, { headers });
}

  // Méthode pour afficher la liste des experience
  AfficherListEexperienceProfessionnelle(): Observable<any> {
    const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
    return this.http.get(`${URL_BASE}amadou/afficher`, { headers });  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
  }

   // Méthode pour afficher la liste des experience
   VoirexperienceProfessionnelle(): Observable<any> {
    const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
    return this.http.get(`${URL_BASE}amadou/voir`, { headers });  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
  }

  modifierExperience(experience: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${URL_BASE}amadou/modifier`, experience, { headers });
  }

  supprimerExperience(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${URL_BASE}amadou/supprimer/${id}`, { headers });
  }

  getExperiencesParUser(userId: number): Observable<any> {
    return this.http.get(`${URL_BASE}amadou/par-user/${userId}`);
  }
}
