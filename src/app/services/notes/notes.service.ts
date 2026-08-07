import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class NotesService {

  constructor(private http: HttpClient) {}

  noter(idProfessionnel: number, valeur: number, commentaire: string): Observable<any> {
    let url = `${URL_BASE}notes/noter/${idProfessionnel}?valeur=${valeur}`;
    if (commentaire) url += `&commentaire=${encodeURIComponent(commentaire)}`;
    return this.http.post(url, null);
  }

  modifierNote(id: number, valeur: number, commentaire: string): Observable<any> {
    let url = `${URL_BASE}notes/modifier/${id}?valeur=${valeur}`;
    if (commentaire) url += `&commentaire=${encodeURIComponent(commentaire)}`;
    return this.http.put(url, null);
  }

  getInfosNotation(idProfessionnel: number): Observable<any> {
    return this.http.get(`${URL_BASE}notes/professionnel/${idProfessionnel}`);
  }

  getMaNote(idProfessionnel: number): Observable<any> {
    return this.http.get(`${URL_BASE}notes/ma-note/${idProfessionnel}`);
  }

  supprimerNote(id: number): Observable<any> {
    return this.http.delete(`${URL_BASE}notes/supprimer/${id}`);
  }
}
