import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TypeProjetService } from '../typeProjet/type-projet.service';
import { map } from 'rxjs/operators';

// Définition de l'URL de base pour les requêtes API
const URL_BASE: string = environment.Url_BASE;  // Définit l'URL de base pour les requêtes API à partir de l'environnement
@Injectable({
  providedIn: 'root'
})

export class ProjetService { private accessToken!: string; // Variable pour stocker le jeton d'accès

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
    const token = this.storageService.getUser().token;  // Obtient le jeton d'accès à partir du service de stockage local
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Crée et retourne les en-têtes HTTP avec le jeton d'accès
    });
  }


  ajouterProjetinformatique(projet: any): Observable<any> {
    return this.http.post(`${URL_BASE}projetInformatique/ajouter`, projet);
  }


  
  
  

// Méthode pour afficher la liste des projets
// AfficherListeProjetInformatique(): Observable<any> {
//   const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
//   return this.http.get(`${URL_BASE}ProjetInformatique/afficher`, { headers });  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
// }

// AfficherListeProjetInformatique(): Observable<number> {
//   const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
//   return this.http.get(`${URL_BASE}projetInformatique/afficher`, { headers })  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
//     .pipe(map((projets: any[]) => projets.length));  // Renvoie le nombre de projets
// }

AfficherListeProjetInformatique(): Observable<any> {
  const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
  return this.http.get(`${URL_BASE}projetInformatique/afficher`, { headers });  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
}


//Projet apr id  : /api/projects/{id}
AfficherProjetParId(id: number): Observable<any> {
  return this.http.get(`${URL_BASE}projetInformatique/projetparid/${id}`);
}

AjouterProjet(data: FormData) {
  const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès

  return this.http.post(
    URL_BASE + 'projetInformatique/ajouter',data, { headers }
  );
}

ajouterProjet(formData: FormData): Observable<any> {
  return this.http.post<Object>('{URL_BASE}projetInformatique/ajouter', formData);
}

// ajouter(titre: string, description: string, typeprojet: string, photo: File): Observable<Object> {
//   const formData: FormData = new FormData();
//   formData.append('titre', titre);
//   formData.append('description', description);
//   formData.append('typeProjet', typeprojet);
  
//   if (photo) {
//     formData.append('photo', photo, photo.name);
//   }
  
//   return this.http.post<Object>('{URL_BASE}projetInformatique/ajouter', formData);
// }

ajouter(data: any): Observable<any> {

  const headers = this.getHeaders();
  const formData = new FormData();
  formData.append('titre', data.titre);
  formData.append('description', data.description);
  formData.append('typeProjet', data.typeProjet);
  formData.append('photo', data.photo);
   console.log(formData);
  console.log('data', data);

  console.log('data', headers);

  return this.http.post(URL_BASE  + 'projetInformatique/ajouter',formData, { headers });
}



// ajouterProjet(titre: string, description: string, typeProjet: string, photo: File): Observable<any> {
//   const formData: FormData = new FormData();
//   formData.append('titre', titre);
//   formData.append('description', description);
//   formData.append('typeProjet', typeProjet);
//   formData.append('photo', photo);

//   return this.http.post<Object>('{URL_BASE}projetInformatique/ajouter', formData);
// }

// ajouterProjet(titre: string, description: string, typeProjet: string, photo: File): Observable<any> {
//   const formData = new FormData();
//   formData.append('titre', titre);
//   formData.append('description', description);
//   formData.append('typeProjet', typeProjet);
//   formData.append('photo', photo);

//   return this.http.post('{URL_BASE}projetInformatique/ajouter', formData);
// }
// ajouterProjet(titre: string, description: string, typeProjet: string, photo: File): Observable<any> {
//   const formData = new FormData();
//   formData.append('titre', titre);
//   formData.append('description', description);
//   formData.append('typeProjet', typeProjet);
//   formData.append('photo', photo);

//   const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès

//   return this.http.post(`${URL_BASE}projetInformatique/ajouter`, formData, { headers });
// }

}
