import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { CookieService } from 'ngx-cookie-service'; // Importez le CookieService

const URL_BASE: string = environment.Url_BASE

const httpOptions: any = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    // private cookieService: CookieService
  ) { }

  // Méthode pour ajouter le token JWT aux en-têtes
  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  //METHODE PERMETTANT DE SE CONNECTER
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

  //METHODE PERMETTANT DE S'INSCRIRE
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

  //METHODE PERMETTANT DE SE DECONNECTER
  // logout(): Observable<any> {
  //   const req = new HttpRequest('POST', URL_BASE + '/logout', {}, httpOptions);
  //   return this.http.request(req);
  // }

  //METHODE PERMETTANT D'ACTUALISER LA PAGE
  reloadPage(): void {
    window.location.reload();
  }

  //METHODE PERMETTANT DE SE DECONNECTER
  logout(): Observable<any> {
    //return this.http.post(AUTH_API + 'signout', {}, httpOptions);
    const req = new HttpRequest('POST', URL_BASE + '/logout', {}, httpOptions);
    return this.http.request(req);
  }

  //ENVOIE D'EMAIL POUR CHANGER LE PASSWORD
  forgotPassword(email: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    console.log(email);

    // const headers = this.getHeaders();
    return this.http.post(URL_BASE + 'auth/forgotPassword', formData);
  }


  //CHANGER PASSWORD APRES OUBLIE
  ChangerPassword(token: string, newPassword: any): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('token', token);
    console.log(token);
    formData.append('newPassword', newPassword);
    return this.http.post(URL_BASE + 'auth/resetPassword', formData);
  }

}
