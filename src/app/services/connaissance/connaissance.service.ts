import { Injectable } from '@angular/core';  // Importe le décorateur Injectable pour permettre l'injection de dépendances
import { StorageService } from '../storage/storage.service';  // Importe le service de stockage local
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Importe le service HTTPClient et HttpHeaders pour effectuer des requêtes HTTP
import { Observable } from 'rxjs';  // Importe Observable pour gérer les opérations asynchrones
import { environment } from 'src/environments/environment'; 

const URL_BASE: string = environment.Url_BASE; 

@Injectable({
  providedIn: 'root'
})
export class ConnaissanceService {
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

// Méthode pour afficher la liste des connaissance
AfficherListeConnaissance(): Observable<any> {
    return this.http.get(`${URL_BASE}connaissance/toutes`);
  }

Ajouter(nom: string,typeConnaissances:string): Observable<any> {
  console.log(nom);
  return this.http.post(
    URL_BASE + 'connaissance/ajouter',
    {
      nom,
      typeConnaissances,
     // Correction ici
    },
    { withCredentials: true }
  );
}

modifierConnaissance(connaissance: any): Observable<any> {
  const headers = this.getHeaders();
  return this.http.put(`${URL_BASE}connaissance/modifier`, connaissance, { headers });
}

supprimerConnaissance(id: number): Observable<any> {
  const headers = this.getHeaders();
  return this.http.delete(`${URL_BASE}connaissance/supprimer/${id}`, { headers });
}

lierConnaissance(connaissanceId: number): Observable<any> {
  const headers = this.getHeaders();
  return this.http.post(`${URL_BASE}connaissance/lier/${connaissanceId}`, {}, { headers });
}

lierPlusieurs(ids: number[]): Observable<any> {
  const headers = this.getHeaders();
  return this.http.post(`${URL_BASE}connaissance/lier-plusieurs`, ids, { headers });
}

retirerConnaissance(id: number): Observable<any> {
  const headers = this.getHeaders();
  return this.http.delete(`${URL_BASE}connaissance/retirer/${id}`, { headers });
}

getConnaissancesParUser(userId: number): Observable<any> {
  return this.http.get(`${URL_BASE}connaissance/par-user/${userId}`);
}

getMesConnaissances(): Observable<any> {
  const headers = this.getHeaders();
  return this.http.get(`${URL_BASE}connaissance/afficher`, { headers });
}

getToutesConnaissances(): Observable<any> {
  return this.http.get(`${URL_BASE}connaissance/toutes`);
}
}
