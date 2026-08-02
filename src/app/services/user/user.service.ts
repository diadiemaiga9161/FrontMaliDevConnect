import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private accessToken!: string;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getHeaders(): HttpHeaders {
    const user = this.storageService.getUser();
    const token = user?.token;
    if (!token) {
      return new HttpHeaders();
    }
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  AfficherInfoUserConnecte(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}user/afficherinfo`, { headers });
  }

  AfficherListeInformaticien(): Observable<any> {
    return this.http.get(`${URL_BASE}user/byRole/ROLE_PROFESSIONNEL`);
  }

  AfficherListeClient(): Observable<any> {
    return this.http.get(`${URL_BASE}user/byRole/ROLE_CLIENT`);
  }

  AfficherListEexperienceProfessionnelle(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}amadou/afficher`, { headers });
  }

  AfficherListConnaissance(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}connaissance/toutes`, { headers });
  }
  
  AfficherListeCommentaire(): Observable<any> {
    return this.http.get(`${URL_BASE}commentaires/afficher`);
  }

  listeUtilisateur(): Observable<any> {
    return this.http.get(`${URL_BASE}user/afficher`);
  }

  Afficherbiographie(): Observable<any> {
    return this.http.get(`${URL_BASE}biographie/afficher`);
  }

  AfficherInformaticienParId(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}user/userparid/${id}`, { headers });
  }

  AfficherProjetInformatiqueParId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}projetInformatique/projetparid/${id}`);
  }
  
  AfficherListeProjetInformatique(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}projetInformatique/afficher`, { headers });
  }

  // 📌 MODIFIER UN PROJET
  modifierProjet(id: number, titre: string, description: string, typeProjet: any, photo: File): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('typeProjet', typeProjet);
    formData.append('photo', photo);
    return this.http.put(`${URL_BASE}projetInformatique/modifier/${id}`, formData, { headers });
  }

  // 📌 SUPPRIMER UN PROJET
  supprimerProjet(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${URL_BASE}projetInformatique/supprimer/${id}`, { headers });
  }

  // 📌 VOIR LES PROJETS DE L'UTILISATEUR CONNECTÉ
  voirMesProjets(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}projetInformatique/voir`, { headers });
  }

  Ajouter(titre: string, datedebut: string, datefin: string, lieux: string, id_utilisateur: any): Observable<any> {
    return this.http.post(
      URL_BASE + 'amadou/ajouter',
      {
        titre,
        datedebut,
        datefin,
        lieux,
        id_utilisateur
      },
      { withCredentials: true }
    );
  }

  modifierProfilUser(
    nom: string,
    prenom: string,
    telephone: string,
    adresse: string,
    genre: string,
    email: string,
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(
      URL_BASE + 'user/update',
      {
        nom,
        prenom,
        telephone,
        adresse,
        genre,
        email,
      },
      { headers }
    );
  }

  AfficherPhotoUserConnecter(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}user/photo/get`, { headers });
  }

  modifierMotDePasse(oldPassword: string, newPassword: string): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('oldPassword', oldPassword);
    formData.append('newPassword', newPassword);
    return this.http.post(
      URL_BASE + 'auth/updatePassword',
      formData,
      { headers }
    );
  }

  changerPhoto(photo: File): Observable<any> {
    const headers = this.getHeaders().set('Cache-Control', 'no-cache');
    const formData = new FormData();
    formData.append('photo', photo);
    return this.http.put(`${URL_BASE}user/updatePhoto`, formData, { headers });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${URL_BASE}auth/api/password_reset/`, {
      email
    });
  }

  ChangerPassword(token: string, password: any): Observable<any> {
    return this.http.post(`${URL_BASE}auth/api/password_reset/confirm/?token=${token}`, {
      password
    });
  }

  ajouterExperience(experience: any): Observable<any> {
    return this.http.post(`${URL_BASE}amadou/ajouter`, experience);
  }

  ajouterProjet(formData: FormData): Observable<any> {
    return this.http.post(`${URL_BASE}projetInformatique/ajouter`, formData);
  }

  ajouterPhotosProjet(projetId: number, photos: FileList): Observable<any> {
    const formData = new FormData();
    Array.from(photos).forEach(p => formData.append('photos', p));
    return this.http.post(`${URL_BASE}projetInformatique/${projetId}/ajouter-photos`, formData);
  }

  supprimerPhotoProjet(photoId: number): Observable<any> {
    return this.http.delete(`${URL_BASE}projetInformatique/photo/${photoId}`);
  }

  getProjetsParUser(userId: number): Observable<any> {
    return this.http.get(`${URL_BASE}projetInformatique/par-user/${userId}`);
  }

  voirProfil(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}user/profil/${id}`);
  }

  getPlusVus(): Observable<any> {
    return this.http.get(`${URL_BASE}user/plus-vus`);
  }

  genererLienPartage(): Observable<any> {
    return this.http.post(`${URL_BASE}user/generer-lien`, {});
  }

  getProfilPublic(token: string): Observable<any> {
    return this.http.get(`${URL_BASE}profil/public/${token}`);
  }

  completerProfil(data: any): Observable<any> {
    return this.http.put(`${URL_BASE}user/completer-profil`, data);
  }

  getMesSpecialites(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}user/specialites`, { headers });
  }

  ajouterSpecialiteSupp(specialiteId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${URL_BASE}user/specialite/ajouter/${specialiteId}`, {}, { headers });
  }

  retirerSpecialiteSupp(specialiteId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${URL_BASE}user/specialite/retirer/${specialiteId}`, { headers });
  }

  getSpecialitesParUserId(userId: number): Observable<any> {
    return this.http.get(`${URL_BASE}user/specialites/${userId}`);
  }

  getConnaissancesParUser(userId: number): Observable<any> {
    return this.http.get(`${URL_BASE}connaissance/par-user/${userId}`);
  }

  getExperiencesParUser(userId: number): Observable<any> {
    return this.http.get(`${URL_BASE}amadou/par-user/${userId}`);
  }

  getBiographieParUser(userId: number): Observable<any> {
    return this.http.get(`${URL_BASE}biographie/par-user/${userId}`);
  }

  ajouterBiographie(contenu: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${URL_BASE}biographie/ajouter`, { biographie: contenu }, { headers });
  }

  modifierBiographie(id: number, contenu: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${URL_BASE}biographie/modifier`, { id, biographie: contenu }, { headers });
  }

  getChatToken(userId: number): Observable<any> {
    return this.http.get(`${URL_BASE}user/chat-token/${userId}`);
  }

  getPublicKey(userId: number): Observable<any> {
    return this.http.get(`${URL_BASE}user/public-key/${userId}`);
  }

  savePublicKey(publicKey: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${URL_BASE}user/public-key`, { publicKey }, { headers });
  }
}
