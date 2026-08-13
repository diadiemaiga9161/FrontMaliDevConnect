import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE;

export interface OffreEmploiPayload {
  titre: string;
  description?: string;
  typeContrat?: string;
  lieu?: string;
  dateLimite?: string;
  specialiteId?: number | null;
  connaissanceIds?: number[];
}

@Injectable({ providedIn: 'root' })
export class OffreEmploiService {

  constructor(private http: HttpClient) {}

  private buildParams(offre: OffreEmploiPayload): HttpParams {
    let params = new HttpParams().set('titre', offre.titre);
    if (offre.description) params = params.set('description', offre.description);
    if (offre.typeContrat) params = params.set('typeContrat', offre.typeContrat);
    if (offre.lieu) params = params.set('lieu', offre.lieu);
    if (offre.dateLimite) params = params.set('dateLimite', offre.dateLimite);
    if (offre.specialiteId != null) params = params.set('specialiteId', offre.specialiteId.toString());
    if (offre.connaissanceIds && offre.connaissanceIds.length) {
      offre.connaissanceIds.forEach(id => { params = params.append('connaissanceIds', id.toString()); });
    }
    return params;
  }

  ajouter(offre: OffreEmploiPayload, photos?: File[] | FileList | null): Observable<any> {
    let params = this.buildParams(offre);
    const formData = new FormData();
    if (photos) {
      Array.from(photos).forEach(f => formData.append('photos', f));
    }
    return this.http.post(`${URL_BASE}offres/ajouter`, formData, { params });
  }

  modifier(id: number, offre: OffreEmploiPayload): Observable<any> {
    return this.http.put(`${URL_BASE}offres/modifier/${id}`, null, { params: this.buildParams(offre) });
  }

  supprimer(id: number): Observable<any> {
    return this.http.delete(`${URL_BASE}offres/supprimer/${id}`);
  }

  ajouterPhotos(offreId: number, photos: File[] | FileList): Observable<any> {
    const formData = new FormData();
    Array.from(photos).forEach(f => formData.append('photos', f));
    return this.http.post(`${URL_BASE}offres/${offreId}/ajouter-photos`, formData);
  }

  supprimerPhoto(photoId: number): Observable<any> {
    return this.http.delete(`${URL_BASE}offres/photo/${photoId}`);
  }

  afficherToutes(): Observable<any> {
    return this.http.get(`${URL_BASE}offres/afficher`);
  }

  mesOffres(): Observable<any> {
    return this.http.get(`${URL_BASE}offres/mes-offres`);
  }

  parId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}offres/${id}`);
  }

  parToken(token: string): Observable<any> {
    return this.http.get(`${URL_BASE}offres/public/${token}`);
  }

  parEntreprise(entrepriseId: number): Observable<any> {
    return this.http.get(`${URL_BASE}offres/par-entreprise/${entrepriseId}`);
  }

  profilsRecommandes(offreId: number): Observable<any> {
    return this.http.get(`${URL_BASE}offres/${offreId}/profils-recommandes`);
  }
}
