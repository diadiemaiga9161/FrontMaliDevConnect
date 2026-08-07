import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class AdminService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  private headers(): HttpHeaders {
    const token = this.storageService.getUser()?.token;
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ── Statistiques ────────────────────────────────────────────
  getStats(): Observable<any> {
    return this.http.get(`${URL_BASE}admin/stats`, { headers: this.headers() });
  }

  // ── Utilisateurs ────────────────────────────────────────────
  getTousUtilisateurs(): Observable<any> {
    return this.http.get(`${URL_BASE}admin/users`, { headers: this.headers() });
  }

  getProfessionnels(): Observable<any> {
    return this.http.get(`${URL_BASE}user/byRole/ROLE_PROFESSIONNEL`, { headers: this.headers() });
  }

  getClients(): Observable<any> {
    return this.http.get(`${URL_BASE}user/byRole/ROLE_CLIENT`, { headers: this.headers() });
  }

  banUser(id: number): Observable<any> {
    return this.http.put(`${URL_BASE}admin/user/ban/${id}`, {}, { headers: this.headers() });
  }

  debanUser(id: number): Observable<any> {
    return this.http.put(`${URL_BASE}admin/user/deban/${id}`, {}, { headers: this.headers() });
  }

  validerProfil(id: number): Observable<any> {
    return this.http.put(`${URL_BASE}admin/user/valider/${id}`, {}, { headers: this.headers() });
  }

  supprimerUser(id: number): Observable<any> {
    return this.http.delete(`${URL_BASE}admin/user/supprimer/${id}`, { headers: this.headers() });
  }

  creerUser(data: any): Observable<any> {
    return this.http.post(`${URL_BASE}admin/user/creer`, data, { headers: this.headers() });
  }

  getUserDetail(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}admin/user/${id}`, { headers: this.headers() });
  }

  // ── Spécialités ─────────────────────────────────────────────
  getSpecialites(): Observable<any> {
    return this.http.get(`${URL_BASE}specialite/afficher`, { headers: this.headers() });
  }

  ajouterSpecialite(data: any): Observable<any> {
    return this.http.post(`${URL_BASE}specialite/ajouter`, data, { headers: this.headers() });
  }

  modifierSpecialite(id: number, data: any): Observable<any> {
    return this.http.put(`${URL_BASE}specialite/modifier/${id}`, data, { headers: this.headers() });
  }

  supprimerSpecialite(id: number): Observable<any> {
    return this.http.delete(`${URL_BASE}specialite/supprimer/${id}`, { headers: this.headers() });
  }

  // ── Compétences / Connaissances ─────────────────────────────
  getConnaissances(): Observable<any> {
    return this.http.get(`${URL_BASE}connaissance/toutes`, { headers: this.headers() });
  }

  ajouterConnaissance(data: any): Observable<any> {
    return this.http.post(`${URL_BASE}connaissance/ajouter`, data, { headers: this.headers() });
  }

  modifierConnaissance(id: number, data: any): Observable<any> {
    return this.http.put(`${URL_BASE}connaissance/modifier/${id}`, data, { headers: this.headers() });
  }

  supprimerConnaissance(id: number): Observable<any> {
    return this.http.delete(`${URL_BASE}connaissance/supprimer/${id}`, { headers: this.headers() });
  }

  // ── Types de Projets ────────────────────────────────────────
  getTypeProjets(): Observable<any> {
    return this.http.get(`${URL_BASE}typeprojet/afficher`, { headers: this.headers() });
  }

  ajouterTypeProjet(data: any): Observable<any> {
    return this.http.post(`${URL_BASE}typeProjet/ajouter`, data, { headers: this.headers() });
  }

  modifierTypeProjet(id: number, data: any): Observable<any> {
    return this.http.put(`${URL_BASE}typeProjet/modifier/${id}`, data, { headers: this.headers() });
  }

  supprimerTypeProjet(id: number): Observable<any> {
    return this.http.delete(`${URL_BASE}typeProjet/supprimer/${id}`, { headers: this.headers() });
  }

  // ── Types de RDV ────────────────────────────────────────────
  getTypeRdvs(): Observable<any> {
    return this.http.get(`${URL_BASE}typerdv/afficher`, { headers: this.headers() });
  }

  ajouterTypeRdv(data: any): Observable<any> {
    return this.http.post(`${URL_BASE}typerdv/ajouter`, data, { headers: this.headers() });
  }

  modifierTypeRdv(id: number, data: any): Observable<any> {
    return this.http.put(`${URL_BASE}typerdv/modifier/${id}`, data, { headers: this.headers() });
  }

  supprimerTypeRdv(id: number): Observable<any> {
    return this.http.delete(`${URL_BASE}typerdv/supprimer/${id}`, { headers: this.headers() });
  }
}
