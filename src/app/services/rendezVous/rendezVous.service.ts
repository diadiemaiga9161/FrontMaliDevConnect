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
  user: User;
  userEvoyer?: User;
  typeRdv: TypeRdv;
  statut?: string;
  dateAcceptation?: Date;
  dateAnnulation?: Date;
  motifAnnulation?: string;
  isNotified?: boolean;
}

// Modèle de données pour l'utilisateur
export interface User {
  id: number;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  photos?: any[];
  specialite?: any;
}

// Modèle de données pour le type de rendez-vous
export interface TypeRdv {
  id: number;
  typerdv?: string;
}

// Définition de l'URL de base pour les requêtes API
const URL_BASE: string = environment.Url_BASE;

// Injectable permettant l'injection de dépendances pour ce service
@Injectable({
  providedIn: 'root'
})
export class RdvService {
  private accessToken!: string;

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
    const user = this.storageService.getUser();
    const token = user?.token || user?.accessToken;
    if (!token) return new HttpHeaders();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  //PRENDRE RENDEZ-VOUS 
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
    formData.append('userRecu', typeof userRecu === 'object' ? JSON.stringify(userRecu) : userRecu || '');
    return this.http.post(`${URL_BASE}rdv/ajouter`, formData, { headers });
  }

  //AFFICHER TOUS LES RENDEZ-VOUS
  AfficherListeRdv(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}rdv/afficher`, { headers });
  }

  //AFFICHER LES RDV RECUS PAR L'UTILISATEUR CONNECTE
  AfficherRdvParRecuParUserConnecter(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}rdv/get/mine`, { headers });
  }

  //AFFICHER LES RDV ENVOYES PAR L'UTILISATEUR CONNECTE
  AfficherRdvParEnvoyerParUserConnecterNew(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}rdv/get`, { headers });
  }

  //AFFICHER UN RDV PAR SON ID
  AfficherRdvParId(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}rdv/afficherparId/${id}`, { headers });
  }

  //AFFICHER LES RENDEZ-VOUS NON NOTIFIES
  AfficherRdvParRecuParUserConnecters(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}rdv/rdvNonNotifies`, { headers });
  }

  //MODIFIER UN RENDEZ-VOUS
  ModifierRendezVous(rendezVous: RendezVous): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${URL_BASE}rdv/modifier`, rendezVous, { headers });
  }

  //SUPPRIMER UN RENDEZ-VOUS
  SupprimerRendezVous(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${URL_BASE}rdv/supprimer/${id}`, { headers });
  }

  //ACCEPTER UN RENDEZ-VOUS
  AccepterRendezVous(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${URL_BASE}rdv/accepter/${id}`, null, { headers });
  }

  //REFUSER UN RENDEZ-VOUS
  RefuserRendezVous(id: number, motif?: string): Observable<any> {
    const headers = this.getHeaders();
    let url = `${URL_BASE}rdv/refuser/${id}`;
    if (motif) {
      url += `?motif=${encodeURIComponent(motif)}`;
    }
    return this.http.put(url, null, { headers });
  }

  //ANNULER UN RENDEZ-VOUS
  AnnulerRendezVous(id: number, motif?: string): Observable<any> {
    const headers = this.getHeaders();
    let url = `${URL_BASE}rdv/annuler/${id}`;
    if (motif) {
      url += `?motif=${encodeURIComponent(motif)}`;
    }
    return this.http.put(url, null, { headers });
  }

  //PROPOSER UNE AUTRE DATE
  ProposerAutreDate(id: number, nouvelleDate: string, nouvelleHeure: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${URL_BASE}rdv/proposer-date/${id}?nouvelleDate=${encodeURIComponent(nouvelleDate)}&nouvelleHeure=${encodeURIComponent(nouvelleHeure)}`;
    return this.http.put(url, null, { headers });
  }

  //AFFICHER LES RDV RECUS PAR STATUT
  AfficherRdvRecuParStatut(statut: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}rdv/get/mine/statut/${statut}`, { headers });
  }

  //AFFICHER LES RDV ENVOYES PAR STATUT
  AfficherRdvEnvoyeParStatut(statut: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}rdv/get/envoye/statut/${statut}`, { headers });
  }

  //METTRE A JOUR LE STATUT D'UN RDV
  MettreAJourStatut(id: number, statut: string, motif?: string): Observable<any> {
    const headers = this.getHeaders();
    let url = `${URL_BASE}rdv/statut/${id}?statut=${statut}`;
    if (motif) {
      url += `&motif=${encodeURIComponent(motif)}`;
    }
    return this.http.put(url, null, { headers });
  }

  //AFFICHER LES RDV EN ATTENTE RECUS
  AfficherRdvEnAttenteRecus(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}rdv/get/mine/en-attente`, { headers });
  }

  //AFFICHER LES RDV ACCEPTES RECUS
  AfficherRdvAcceptesRecus(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}rdv/get/mine/acceptes`, { headers });
  }

  //OBTENIR L'ID DE L'UTILISATEUR CONNECTE
  private getCurrentUserId(): number | null {
    const user = this.storageService.getUser();
    return user?.id || null;
  }

  //VERIFIER SI UN RDV PEUT ETRE ACCEPTE
  PeutAccepterRendezVous(rendezVous: any): boolean {
    return rendezVous && 
           rendezVous.statut === 'EN_ATTENTE' && 
           rendezVous.user?.id === this.getCurrentUserId();
  }

  //VERIFIER SI UN RDV PEUT ETRE REFUSE
  PeutRefuserRendezVous(rendezVous: any): boolean {
    return rendezVous && 
           rendezVous.statut === 'EN_ATTENTE' && 
           rendezVous.user?.id === this.getCurrentUserId();
  }

  //VERIFIER SI UN RDV PEUT ETRE ANNULE
  PeutAnnulerRendezVous(rendezVous: any): boolean {
    return rendezVous && 
           (rendezVous.statut === 'EN_ATTENTE' || rendezVous.statut === 'ACCEPTE') && 
           rendezVous.userEvoyer?.id === this.getCurrentUserId();
  }

  //OBTENIR LE LIBELLE DU STATUT
  getStatutLibelle(statut: string): string {
    const statuts: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'ACCEPTE': 'Accepté',
      'REFUSE': 'Refusé',
      'ANNULE': 'Annulé'
    };
    return statuts[statut] || statut;
  }

  //OBTENIR LA COULEUR DU STATUT
  getStatutCouleur(statut: string): string {
    const couleurs: { [key: string]: string } = {
      'EN_ATTENTE': 'warning',
      'ACCEPTE': 'success',
      'REFUSE': 'danger',
      'ANNULE': 'secondary'
    };
    return couleurs[statut] || 'dark';
  }

  //OBTENIR L'ICONE DU STATUT
  getStatutIcone(statut: string): string {
    const icones: { [key: string]: string } = {
      'EN_ATTENTE': 'clock',
      'ACCEPTE': 'check-circle',
      'REFUSE': 'times-circle',
      'ANNULE': 'ban'
    };
    return icones[statut] || 'circle';
  }
}