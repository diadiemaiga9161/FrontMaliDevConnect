import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { CookieService } from 'ngx-cookie-service';


const API_URL = 'http://localhost:8080/api/test/';
const URL_BASE: string = environment.Url_BASE
const USER_KEY = 'auth-user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private accessToken!: string; // Ajoutez cette ligne


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem(USER_KEY) // Remplacez par votre token JWT valide
    })
  };
  constructor(
    private http: HttpClient,
    // private cookieService: CookieService,
    private storageService: StorageService
  ) { }


  setAccessToken(token: string) {
    this.accessToken = token;
  }
  // Méthode pour ajouter le token JWT aux en-têtes
  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    // Récupérez le jeton CSRF depuis le cookie
    // const csrfToken = this.cookieService.get('csrftoken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      // 'X-CSRFToken': csrfToken
    });
  }

  //AFFICHER LES INFORMATIONS DE USER CONNECTE
  AfficherInfoUserConnecte(): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers)
    return this.http.get(`${URL_BASE}user/afficherinfo`, { headers });
  }

  //AFFICHER LA LISTE DES INFORMATICIENS
  AfficherListeInformaticien(): Observable<any> {
    return this.http.get(`${URL_BASE}user/byRole/ROLE_INFORMATICIEN`);
  }

  //AFFICHER UN INFORMATICIEN EN FONCTION DE SON ID
  AfficherInformaticienParId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}user/userparid/${id}`);
  }



  //MODIFIER PROFIL USER
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



  //COMPLETER SON PROFIL
  completerProfilFinacier(
    communeId: number,
    ageId: number,
    situationMatrimonialeId: number,
    revenuId: number,
    depenseId: number
  ): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers);

    return this.http.put(
      URL_BASE + 'user/completer',
      {
        commune: { id: communeId }, // Envoyez l'ID de la commune dans un objet
        age: { id: ageId }, // Envoyez l'ID de l'age dans un objet
        situationmatrimoniale: { id: situationMatrimonialeId }, // Envoyez l'ID de situationmatrimoniale dans un objet
        revenu: { id: revenuId }, // Envoyez l'ID du revenu dans un objet
        depense: { id: depenseId }, // Envoyez l'ID de la depense dans un objet
      },
      { headers }
    );
  }




  //AFFICHER LA PHOTO DE USER CONNECTER
  AfficherPhotoUserConnecter(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/user/photo/get`, { headers });
  }

  //CHANGER MOT DE PASSE
  modifierMotDePasse(oldPassword: string, newPassword: string): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers);
    console.log(oldPassword);
    console.log(newPassword);
    const formData = new FormData();
    formData.append('oldPassword', oldPassword);
    formData.append('newPassword', newPassword);
    return this.http.post(
      URL_BASE + 'auth/updatePassword',
      formData,
      { headers }
    );
  }

  //CHANGER PHOTO PROFILE
  changerPhoto(photo: File): Observable<any> {
    const headers = this.getHeaders();
    headers.set('Cache-Control', 'no-cache'); // Désactive le cache pour cette requête
    const formData = new FormData();
    formData.append('photo', photo);
    return this.http.put(`${URL_BASE}user/updatePhoto`, formData, { headers });
  }

  //ENVOIE D'EMAIL POUR CHANGER LE PASSWORD
  forgotPassword(email: string): Observable<any> {
    // const headers = this.getHeaders();
    return this.http.post(`${URL_BASE}auth/api/password_reset/`, {
      email
    });
  }

  //CHANGER PASSWORD APRES OUBLIE
  ChangerPassword(token: string, password: any): Observable<any> {
    console.log(password);
    console.log(token);
    return this.http.post(`${URL_BASE}auth/api/password_reset/confirm/?token=${token}`, {
      password
    }
    );
  }

}
