// Importation des modules Angular nécessaires
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Modèle de données pour les rendez-vous
export interface RendezVous {
  id?: number;
  objet: string;
  dateenvoie: Date;
  dateRendezvous: string;
  heureRendezvous: string;
  user: User;  // Assurez-vous d'importer le modèle User s'il n'est pas déjà importé
  typeRdv: TypeRdv;  // Assurez-vous d'importer le modèle TypeRdv s'il n'est pas déjà importé
}

// Modèle de données pour l'utilisateur (à adapter en fonction de votre implémentation)
export interface User {
  id: number;
  // Ajoutez d'autres propriétés nécessaires
}

// Modèle de données pour le type de rendez-vous (à adapter en fonction de votre implémentation)
export interface TypeRdv {
  id: number;
  // Ajoutez d'autres propriétés nécessaires
}

// Définition de l'URL de base pour les requêtes API
const URL_BASE: string = environment.Url_BASE;

// Injectable permettant l'injection de dépendances pour ce service dans l'ensemble de l'application
@Injectable({
  providedIn: 'root'
})
export class RendezVousService {

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
  getRendezVousList(): Observable<RendezVous[]> {
    const headers = this.getHeaders();
    return this.http.get<RendezVous[]>(`${URL_BASE}rendezvous/afficher`, { headers });
  }

  // Méthode pour créer un nouveau rendez-vous
  createRendezVous(rendezVous: RendezVous): Observable<RendezVous> {
    const headers = this.getHeaders();
    return this.http.post<RendezVous>(`${URL_BASE}rendezvous/creer`, rendezVous, { headers });
  }

  // Méthode pour mettre à jour un rendez-vous existant
  updateRendezVous(rendezVous: RendezVous): Observable<RendezVous> {
    const headers = this.getHeaders();
    return this.http.put<RendezVous>(`${URL_BASE}rendezvous/modifier`, rendezVous, { headers });
  }

  // Méthode pour supprimer un rendez-vous
  deleteRendezVous(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${URL_BASE}rendezvous/supprimer/${id}`, { headers });
  }
}
