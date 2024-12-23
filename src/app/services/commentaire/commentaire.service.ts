import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE; 


@Injectable({
  providedIn: 'root'
})
export class CommentaireService {

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
     const token = this.storageService.getUser().token;  // Obtient le jeton d'accès à partir du service de stockage local
     return new HttpHeaders({
       'Authorization': `Bearer ${token}`  // Crée et retourne les en-têtes HTTP avec le jeton d'accès
     });
   }
 
 // Méthode pour afficher la liste des commentaires  
 AfficherListeCommentaire(): Observable<any> {
     return this.http.get(`${URL_BASE}commentaires/afficher`);  // Effectue une requête GET vers l'API avec les en-têtes d'autorisation
   }
 
   
//  // Méthode pour effectuer l'ajout 
//  Ajoutercommentaire(commentaires: any,id_utilisateur: any): Observable<any> {
//    const headers = this.getHeaders(); // Obtient les en-têtes avec le jeton d'accès
//    const data = { 
//      "commentaires" : commentaires,
//      "id_utilisateur" : id_utilisateur
//    };
//    return this.http.post(
//      URL_BASE + 'commentaire/ajouter',data, { headers }
//    );
//  }
 
  //faire un commentaire dans un profil
   Commentaire(
     commentaires: string, 
     userRecu: any,
     ): Observable<any> {
     const headers = this.getHeaders();
     const formData = new FormData();
     formData.append('commentaires', commentaires || '');
     formData.append('userRecu', userRecu || '');
     return this.http.post(`${URL_BASE}commentaires/ajouter`,
     formData, { headers });
   }
  
 
//  Ajouter(nom: string,typeConnaissances:string): Observable<any> {
//    console.log(nom);
//    return this.http.post(
//      URL_BASE + 'connaissance/ajouter',
//      {
//        nom,
//        typeConnaissances,
//       // Correction ici
//      },
//      { withCredentials: true }
//    );
//  }
 
}
