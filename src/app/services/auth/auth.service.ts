// Importation des modules Angular nécessaires
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { CookieService } from 'ngx-cookie-service'; // Importez le CookieService

// Définition de l'URL de base pour les requêtes API
const URL_BASE: string = environment.Url_BASE;

// Options par défaut pour les requêtes HTTP
const httpOptions: any = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

// Injectable permettant l'injection de dépendances pour ce service dans l'ensemble de l'application
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Constructeur du service avec injection des dépendances nécessaires
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    // private cookieService: CookieService
  ) { }

  // Méthode pour obtenir les en-têtes avec le token JWT
  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Méthode pour effectuer la connexion
  connexion(telephoneOrEmail: string, password: string): Observable<any> {
    console.log(telephoneOrEmail);
    console.log(password);
    return this.http.post(
      URL_BASE + 'auth/signin',
      {
        telephoneOrEmail,
        password,
      },
      { withCredentials: true }
    );
  }

  // Méthode pour effectuer l'inscription
  inscription(
    nom: string,
    prenom: string,
    telephone: string,
    adresse: string,
    genre: string,
    email: string,
    password: string,
    roles: string,
  ): Observable<any> {
    console.log(nom);
    console.log(prenom);
    console.log(email);
    console.log(telephone);
    console.log(adresse);
    console.log(genre);
    console.log(password);
    console.log(roles);

    return this.http.post(
      URL_BASE + 'auth/signup',
      {
        nom,
        prenom,
        telephone,
        adresse,
        genre,
        email,
        password,
        role: [roles, 'userRole']
      },
      httpOptions
    );
  }

  // Méthode pour effectuer la déconnexion
  logout(): Observable<any> {
    const req = new HttpRequest('POST', URL_BASE + '/logout', {}, httpOptions);
    return this.http.request(req);
  }
   //METHODE PERMETTANT DE SE DECONNECTER
  // logout(): Observable<any> {
  //   const req = new HttpRequest('POST', URL_BASE + '/logout', {}, httpOptions);
  //   return this.http.request(req);
  // }

  // Méthode pour actualiser la page
  reloadPage(): void {
    window.location.reload();
  }

  // Méthode pour envoyer un email de récupération de mot de passe
  forgotPassword(email: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    console.log(email);

    return this.http.post(URL_BASE + 'auth/forgotPassword', formData);
  }

  // Méthode pour changer le mot de passe après récupération
  ChangerPassword(token: string, newPassword: any): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('token', token);
    console.log(token);
    formData.append('newPassword', newPassword);
    return this.http.post(URL_BASE + 'auth/resetPassword', formData);
  }
}
