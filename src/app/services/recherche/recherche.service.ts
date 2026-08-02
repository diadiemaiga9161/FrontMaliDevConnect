import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class RechercheService {

  constructor(private http: HttpClient) {}

  rechercherProfessionnels(nom?: string, specialiteId?: number, categorie?: string): Observable<any> {
    let params = new HttpParams();
    if (nom) params = params.set('nom', nom);
    if (specialiteId) params = params.set('specialiteId', specialiteId.toString());
    if (categorie) params = params.set('categorie', categorie);
    return this.http.get(`${URL_BASE}recherche/professionnels`, { params });
  }

  parCategorie(categorie: string): Observable<any> {
    return this.http.get(`${URL_BASE}recherche/par-categorie/${categorie}`);
  }

  parSpecialite(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}recherche/par-specialite/${id}`);
  }
}
