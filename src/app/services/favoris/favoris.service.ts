import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class FavorisService {

  constructor(private http: HttpClient) {}

  ajouterFavori(idUser: number): Observable<any> {
    return this.http.post(`${URL_BASE}favoris/ajouter/${idUser}`, {});
  }

  retirerFavori(idUser: number): Observable<any> {
    return this.http.delete(`${URL_BASE}favoris/retirer/${idUser}`);
  }

  getMesFavoris(): Observable<any> {
    return this.http.get(`${URL_BASE}favoris`);
  }

  verifierFavori(idUser: number): Observable<any> {
    return this.http.get(`${URL_BASE}favoris/verifier/${idUser}`);
  }
}
