import { Injectable } from '@angular/core';  // Importe le décorateur Injectable pour permettre l'injection de dépendances
import { StorageService } from '../storage/storage.service';  // Importe le service de stockage local
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Importe le service HTTPClient et HttpHeaders pour effectuer des requêtes HTTP
import { Observable } from 'rxjs';  // Importe Observable pour gérer les opérations asynchrones
import { environment } from 'src/environments/environment'; 

const URL_BASE: string = environment.Url_BASE; 

@Injectable({
  providedIn: 'root'
})
export class TypeConnaissanceService {

// Constructeur du service avec injection des dépendances nécessaires
constructor(
  private http: HttpClient,  // Injection du service HttpClient pour effectuer des requêtes HTTP
  private storageService: StorageService,  // Injection du service de stockage local
) { }


// Méthode pour obtenir les en-têtes avec le token JWT
getHeaders(): HttpHeaders {
  const token = this.storageService.getUser().token;  // Obtient le jeton d'accès à partir du service de stockage local
  return new HttpHeaders({
    'Authorization': `Bearer ${token}`  // Crée et retourne les en-têtes HTTP avec le jeton d'accès
  });
}

// Méthode pour afficher la liste des typeconnaissance
AfficherListeTypeConnaissance(): Observable<any> {
  const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
  return this.http.get(`${URL_BASE}typeconnaissance/afficher`, { headers });  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
}
}
