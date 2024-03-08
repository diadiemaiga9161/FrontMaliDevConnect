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
    const token = this.storageService.getUser().token;  // Obtient le jeton d'accès à partir du service de stockage local
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Crée et retourne les en-têtes HTTP avec le jeton d'accès
    });
  }

  // Méthode pour afficher la liste des experience
  AfficherListeExperience(): Observable<any> {
    const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
    return this.http.get(`${URL_BASE}experience/afficher`, { headers });  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
  }
}
