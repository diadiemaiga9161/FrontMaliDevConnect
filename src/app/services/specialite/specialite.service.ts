import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class SpecialiteService {

  private accessToken!: string; // Ajoutez cette ligne

  constructor(private http: HttpClient,
    private storageService: StorageService,
  ) { }


  setAccessToken(token: string) {
    this.accessToken = token;
  }
  // Méthode pour ajouter le token JWT aux en-têtes
  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  //AFFICHER LA LISTE DES SPECIALITES
  AfficherListeSPecialite(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}specialite/afficher`, { headers });
  }

}
