// Importation des modules Angular nécessaires
import { Injectable } from '@angular/core';  // Importe le décorateur Injectable pour permettre l'injection de dépendances
import { StorageService } from '../storage/storage.service';  // Importe le service de stockage local
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Importe le service HTTPClient et HttpHeaders pour effectuer des requêtes HTTP
import { Observable } from 'rxjs';  // Importe Observable pour gérer les opérations asynchrones
import { environment } from 'src/environments/environment';  // Importe l'environnement pour obtenir l'URL de base de l'API

// Définition de l'URL de base pour les requêtes API
const URL_BASE: string = environment.Url_BASE;  // Définit l'URL de base pour les requêtes API à partir de l'environnement

// Injectable permettant l'injection de dépendances pour ce service dans l'ensemble de l'application
@Injectable({
  providedIn: 'root'  // Spécifie que ce service est injecté dans toute l'application
})
export class SpecialiteService {

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

  // Méthode pour afficher la liste des spécialités
  AfficherListeSPecialite(): Observable<any> {
    const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
    return this.http.get(`${URL_BASE}specialite/afficher`, { headers });  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
  }
}
