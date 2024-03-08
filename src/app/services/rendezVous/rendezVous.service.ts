// Importation des modules Angular nécessaires
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Modèle de données pour les rendez-vous
// export interface RendezVous {
//   id?: number;
//   objet: string;
//   dateenvoie: Date;
//   dateRendezvous: string;
//   heureRendezvous: string;
//   user: User;  // Assurez-vous d'importer le modèle User s'il n'est pas déjà importé
//   typeRdv: TypeRdv;  // Assurez-vous d'importer le modèle TypeRdv s'il n'est pas déjà importé
// }

// // Modèle de données pour l'utilisateur (à adapter en fonction de votre implémentation)
// export interface User {
//   id: number;
//   // Ajoutez d'autres propriétés nécessaires
// }

// // Modèle de données pour le type de rendez-vous (à adapter en fonction de votre implémentation)
// export interface TypeRdv {
//   id: number;
//   // Ajoutez d'autres propriétés nécessaires
// }

// Définition de l'URL de base pour les requêtes API
const URL_BASE: string = environment.Url_BASE;

// Injectable permettant l'injection de dépendances pour ce service dans l'ensemble de l'application
@Injectable({
  providedIn: 'root'
})
export class RdvService {

  private accessToken!: string;

  // Constructeur du service avec injection des dépendances nécessaires
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) { }

  // Méthode pour définir le jeton d'accès
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  // Méthode pour obtenir les en-têtes avec le token JWT
  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Méthode pour récupérer la liste des rendez-vous
  // getRdvList(): Observable<Rdv[]> {
  //   const headers = this.getHeaders();
  //   return this.http.get<Rdv[]>(`${URL_BASE}rdv/afficher`, { headers });
  // }

  // // Méthode pour créer un nouveau rendez-vous
  // createRdv(rdv: Rdv): Observable<Rdv> {
  //   const headers = this.getHeaders();
  //   return this.http.post<Rdv>(`${URL_BASE}rdv/ajouter`, rdv, { headers });
  // }

  // // Méthode pour mettre à jour un rendez-vous existant
  // updateRdv(Rdv: Rdv): Observable<Rdv> {
  //   const headers = this.getHeaders();
  //   return this.http.put<Rdv>(`${URL_BASE}rdv/modifier`, Rdv, { headers });
  // }

  // Méthode pour supprimer un rendez-vous
  // deleteRdv(id: number): Observable<void> {
  //   const headers = this.getHeaders();
  //   return this.http.delete<void>(`${URL_BASE}Rdv/supprimer/${id}`, { headers });
  // }

  //PRENDRE RENDEZ-VOUS EN FONCTION DU BIEN
  PrendreRdv(
    objet: string, 
    dateRendezvous: string, 
    heureRendezvous: string, 
    userRecu: any,
    typeRendezVousId: any
    ): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('objet', objet || '');
    formData.append('dateRendezvous', dateRendezvous || '');
    formData.append('heureRendezvous', heureRendezvous || '');
    formData.append('typeRendezVousId', typeRendezVousId ? typeRendezVousId.toString() : '');
    formData.append('userRecu', userRecu || '');
    return this.http.post(`${URL_BASE}rdv/ajouter`,
    formData, { headers });
  }

  AfficherListeRdv(): Observable<any> {
    const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
    return this.http.get(`${URL_BASE}rdv/afficher`, { headers });  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
  }

  AfficherRdvParRecuParUserConnecter(): Observable<any> {
    const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
    return this.http.get(`${URL_BASE}rdv/get/mine`, { headers });  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
  }


        // AFFICHER LA LISTE DES RENDEVOUS ENVOYER PAR USER CONNECTER
  AfficherRdvParEnvoyerParUserConnecterNew(): Observable<any> {
    const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
    return this.http.get(`${URL_BASE}rdv/get`, { headers });  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
  }
}
