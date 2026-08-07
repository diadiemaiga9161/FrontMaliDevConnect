import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const URL_BASE = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private _count = new BehaviorSubject<number>(0);
  count$ = this._count.asObservable();

  constructor(private http: HttpClient) {}

  // ── Compteur partagé ────────────────────────────────

  refreshCount(): void {
    this.compterNonLues().subscribe(n => this._count.next(n));
  }

  setCount(n: number): void {
    this._count.next(n);
  }

  increment(): void {
    this._count.next(this._count.getValue() + 1);
  }

  // ── HTTP ────────────────────────────────────────────

  getMesNotifications(): Observable<any> {
    return this.http.get(`${URL_BASE}notifications`);
  }

  getNonLues(): Observable<any> {
    return this.http.get(`${URL_BASE}notifications/non-lues`);
  }

  compterNonLues(): Observable<number> {
    return this.http.get<any>(`${URL_BASE}notifications/count`).pipe(
      map(response => typeof response === 'number' ? response : Number(response?.count || 0))
    );
  }

  marquerCommeLue(id: number): Observable<any> {
    return this.http.put(`${URL_BASE}notifications/lire/${id}`, {});
  }

  marquerToutesCommeLues(): Observable<any> {
    return this.http.put(`${URL_BASE}notifications/lire-tout`, {});
  }
}
