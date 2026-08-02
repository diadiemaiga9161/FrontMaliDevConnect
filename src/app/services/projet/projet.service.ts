import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TypeProjetService } from '../typeProjet/type-projet.service';

// Définition de l'URL de base pour les requêtes API
const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class ProjetService { 
  private accessToken!: string; // Variable pour stocker le jeton d'accès

  // Constructeur du service avec injection des dépendances nécessaires
  constructor(
    private http: HttpClient,  // Injection du service HttpClient pour effectuer des requêtes HTTP
    private storageService: StorageService, 
    private typeProjetService: TypeProjetService, // Injection du service de stockage local
  ) { }

  // Méthode pour définir le jeton d'accès
  setAccessToken(token: string) {
    this.accessToken = token;  // Affecte la valeur du jeton d'accès reçu à la variable privée accessToken
  }
  
  // Méthode pour obtenir les en-têtes avec le token JWT
  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser()?.token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token ?? ''}`
    });
  }

  // Méthode pour ajouter un projet avec FormData (correspond à @PostMapping("/ajouter"))
  ajouterProjet(formData: FormData): Observable<any> {
    const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
    // Note: Ne pas définir le Content-Type, le navigateur le fera automatiquement avec la boundary pour FormData
    return this.http.post(`${URL_BASE}projetInformatique/ajouter`, formData, { headers });
  }

  // Méthode alternative pour ajouter un projet avec des paramètres individuels
  ajouterProjetWithParams(titre: string, description: string, typeProjet: string, photo: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('typeProjet', typeProjet);
    formData.append('photo', photo, photo.name);
    
    return this.ajouterProjet(formData);
  }

  // Méthode pour afficher la liste de tous les projets (correspond à @GetMapping("/afficher"))
  afficherTousLesProjets(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}projetInformatique/afficher`, { headers });
  }

  // Méthode pour afficher les projets de l'utilisateur connecté (correspond à @GetMapping("/voir"))
  afficherProjetsUtilisateur(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}projetInformatique/voir`, { headers });
  }

  // Méthode pour afficher les projets d'un utilisateur par son ID (consultation de profil)
  getProjetsByUserId(userId: number): Observable<any> {
    return this.http.get(`${URL_BASE}projetInformatique/par-user/${userId}`);
  }

  // Méthode pour afficher les projets du même type (suggestions dans projet-détaillé)
  getProjetsByTypeId(typeProjetId: number, excludeProjetId: number): Observable<any> {
    return this.http.get(`${URL_BASE}projetInformatique/par-type/${typeProjetId}`, {
      params: { excludeId: excludeProjetId.toString() }
    });
  }

  // Méthode pour afficher un projet par son ID (correspond à @GetMapping("/projetparid/{id_projet}"))
  afficherProjetParId(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}projetInformatique/projetparid/${id}`, { headers });
  }

  // Méthode pour modifier un projet (correspond à @PutMapping("modifier/{id}"))
  modifierProjet(id: number, titre: string, description: string, typeProjet: string, photo: File): Observable<any> {
    const headers = this.getHeaders();
    const formData: FormData = new FormData();
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('typeProjet', typeProjet);
    formData.append('photo', photo, photo.name);
    
    return this.http.put(`${URL_BASE}projetInformatique/modifier/${id}`, formData, { headers });
  }

  // Méthode pour modifier un projet avec FormData déjà préparé
  modifierProjetWithFormData(id: number, formData: FormData): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${URL_BASE}projetInformatique/modifier/${id}`, formData, { headers });
  }

  // Méthode pour supprimer un projet (correspond à @DeleteMapping("/supprimer/{id_projet}"))
  supprimerProjet(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${URL_BASE}projetInformatique/supprimer/${id}`, { headers });
  }

  // Méthodes conservées pour la compatibilité (si nécessaire)
  
  ajouterProjetinformatique(projet: any): Observable<any> {
    return this.http.post(`${URL_BASE}projetInformatique/ajouter`, projet);
  }

  AfficherListeProjetInformatique(): Observable<any> {
    return this.http.get(`${URL_BASE}projetInformatique/afficher`);
  }

  AfficherProjetParId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}projetInformatique/projetparid/${id}`);
  }

  AfficherProjet(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}projetInformatique/voir`, { headers });
  }

  AjouterProjet(data: FormData) {
    const headers = this.getHeaders();
    return this.http.post(`${URL_BASE}projetInformatique/ajouter`, data, { headers });
  }

  ajouter(data: any): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('titre', data.titre);
    formData.append('description', data.description);
    formData.append('typeProjet', data.typeProjet);
    formData.append('photo', data.photo);
    
    console.log('formData', formData);
    console.log('data', data);
    console.log('headers', headers);

    return this.http.post(`${URL_BASE}projetInformatique/ajouter`, formData, { headers });
  }
}