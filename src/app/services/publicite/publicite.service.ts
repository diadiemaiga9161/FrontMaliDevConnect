import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE;

// Lecture publique des publicités actives (accueil). Gestion admin (ajout,
// désactivation, suppression) dans admin.service.ts.
@Injectable({ providedIn: 'root' })
export class PubliciteService {

  constructor(private http: HttpClient) {}

  actives(): Observable<any> {
    return this.http.get(`${URL_BASE}publicite/actives`);
  }
}
