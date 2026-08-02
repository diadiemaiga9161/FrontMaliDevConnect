import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class ContactService {

  constructor(private http: HttpClient) {}

  envoyerDemande(idRecepteur: number): Observable<any> {
    return this.http.post(`${URL_BASE}contact/demande/${idRecepteur}`, {});
  }

  accepterDemande(id: number): Observable<any> {
    return this.http.put(`${URL_BASE}contact/accepter/${id}`, {});
  }

  refuserDemande(id: number): Observable<any> {
    return this.http.put(`${URL_BASE}contact/refuser/${id}`, {});
  }

  getDemandesRecues(): Observable<any> {
    return this.http.get(`${URL_BASE}contact/demandes-recues`);
  }

  getDemandesEnvoyees(): Observable<any> {
    return this.http.get(`${URL_BASE}contact/demandes-envoyees`);
  }

  getMesContacts(): Observable<any> {
    return this.http.get(`${URL_BASE}contact/mes-contacts`);
  }

  afficherMesContacts(): Observable<any> {
    return this.http.get(`${URL_BASE}contact/mes-contacts`);
  }

  verifierContact(id1: number, id2: number): Observable<any> {
    return this.http.get(`${URL_BASE}contact/verifier/${id1}/${id2}`);
  }
}

