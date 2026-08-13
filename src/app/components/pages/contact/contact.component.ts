import { Component, OnInit } from '@angular/core';
import { MessageContactService } from 'src/app/services/message-contact/message-contact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  form = { nom: '', email: '', message: '' };
  envoiEnCours = false;

  constructor(private messageContactService: MessageContactService) { }

  ngOnInit(): void {
  }

  envoyer(): void {
    if (!this.form.nom.trim() || !this.form.email.trim() || !this.form.message.trim()) {
      Swal.fire({ title: 'Champs manquants', text: 'Merci de remplir tous les champs.', icon: 'warning', heightAuto: false });
      return;
    }
    this.envoiEnCours = true;
    this.messageContactService.envoyer(this.form.nom.trim(), this.form.email.trim(), this.form.message.trim()).subscribe({
      next: (res) => {
        this.envoiEnCours = false;
        Swal.fire({ title: 'Message envoyé !', text: res?.message || 'Nous vous répondrons rapidement.', icon: 'success', heightAuto: false });
        this.form = { nom: '', email: '', message: '' };
      },
      error: (err) => {
        this.envoiEnCours = false;
        Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible d\'envoyer le message.', icon: 'error', heightAuto: false });
      }
    });
  }
}
