// rdv-details.component.ts
import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/services/popup/popup.service';

@Component({
  selector: 'app-rdv-details',
  templateUrl: './rdv-details.component.html',
  styleUrls: ['./rdv-details.component.scss'],
})
export class RdvDetailsComponent implements OnInit {
  isOpen: boolean;

  constructor(private popupService: PopupService) {
    // Souscrire à l'observable isOpen$ pour mettre à jour l'état du popup
    this.popupService.isOpen$.subscribe((isOpen) => {
      this.isOpen = isOpen;
    });
  }

  ngOnInit(): void {}

  closePopup(): void {
    this.popupService.closePopup();
  }
}
