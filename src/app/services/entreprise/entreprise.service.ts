import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class EntrepriseService {

  constructor(private http: HttpClient) {}

  ajouterOuModifier(data: FormData): Observable<any> {
    return this.http.post(`${URL_BASE}entreprise/ajouter-modifier`, data);
  }

  monProfil(): Observable<any> {
    return this.http.get(`${URL_BASE}entreprise/mon-profil`);
  }

  parUser(userId: number): Observable<any> {
    return this.http.get(`${URL_BASE}entreprise/par-user/${userId}`);
  }

  parToken(token: string): Observable<any> {
    return this.http.get(`${URL_BASE}entreprise/public/${token}`);
  }
}
