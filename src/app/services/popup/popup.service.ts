// popup.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private isOpenSource = new BehaviorSubject<boolean>(false);

  // Observable pour écouter l'état du popup
  isOpen$ = this.isOpenSource.asObservable();

  // Méthodes pour ouvrir et fermer le popup
  openPopup(): void {
    this.isOpenSource.next(true);
  }

  closePopup(): void {
    this.isOpenSource.next(false);
  }
}
