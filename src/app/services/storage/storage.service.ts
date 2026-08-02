import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  // Émet chaque fois que l'utilisateur connecté change (login / photo update)
  readonly userChanged$ = new Subject<any>();

  constructor() {}

  clean(): void {
    window.localStorage.clear();
    this.userChanged$.next(null);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userChanged$.next(user);
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) return JSON.parse(user);
    return {};
  }

  public setUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userChanged$.next(user);
  }

  public isLoggedIn(): boolean {
    const user = window.localStorage.getItem(USER_KEY);
    return !!user;
  }
}
