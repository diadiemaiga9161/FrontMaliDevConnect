import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class CandidatureService {

  constructor(private http: HttpClient) {}

  postuler(offreId: number, message?: string): Observable<any> {
    let params = new HttpParams();
    if (message) params = params.set('message', message);
    return this.http.post(`${URL_BASE}candidatures/postuler/${offreId}`, null, { params });
  }

  mesCandidatures(): Observable<any> {
    return this.http.get(`${URL_BASE}candidatures/mes-candidatures`);
  }

  candidaturesPourOffre(offreId: number): Observable<any> {
    return this.http.get(`${URL_BASE}candidatures/offre/${offreId}`);
  }

  accepter(id: number, motif: string): Observable<any> {
    const params = new HttpParams().set('motif', motif);
    return this.http.put(`${URL_BASE}candidatures/accepter/${id}`, null, { params });
  }

  refuser(id: number, motif: string): Observable<any> {
    const params = new HttpParams().set('motif', motif);
    return this.http.put(`${URL_BASE}candidatures/refuser/${id}`, null, { params });
  }
}
