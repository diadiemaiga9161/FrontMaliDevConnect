import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatModalService {
  private _open = new BehaviorSubject<boolean>(false);
  private _token = new BehaviorSubject<string | null>(null);

  open$ = this._open.asObservable();
  token$ = this._token.asObservable();

  open(token?: string): void {
    if (token) this._token.next(token);
    this._open.next(true);
  }

  close(): void {
    this._open.next(false);
    this._token.next(null);
  }

  toggle(): void {
    this._open.next(!this._open.getValue());
  }

  isCurrentlyOpen(): boolean {
    return this._open.getValue();
  }
}
