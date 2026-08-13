import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { ProjetService } from 'src/app/services/projet/projet.service'
import { AvisService } from 'src/app/services/avis/avis.service';
import { PubliciteService } from 'src/app/services/publicite/publicite.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  User: any;
  informaticien: any;
  searchText : any;
  specialite: any;
  profileImageUrl: string = ''; // Variable pour stocker le chemin de l'image de profil
  connaissance: any;

  // ── Avis plateforme (témoignages) ──
  avisApprouves: any[] = [];
  avisForm = { nom: '', email: '', message: '' };
  avisEnvoiEnCours = false;

  // ── Publicités actives ──
  publicites: any[] = [];

  // nombreDeClient: number = 0;

  // nombreinformaticiens: number = 0;   // à réactiver
  http: any;
  // nombreDeProjets: number = 0;        // à réactiver
  // nombreDeClient: number = 0;         // à réactiver
  // nombreInformaticiens: number = 0;   // à réactiver
  
    generateImageUrl(photoFileName: string): string {
      if (!photoFileName) return 'assets/img/team/amadou.jpg';
      const base = URL_PHOTO.replace(/\/$/, '');
      const path = photoFileName.startsWith('/') ? photoFileName : '/' + photoFileName;
      return base + path;
    }
      // IMAGE PAR DEFAUT USER
   handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/amadou.jpg';
  }
  constructor(
    private serviceUser: UserService,
    private specialiteService: SpecialiteService,
    private connaissanceService: ConnaissanceService,
    private projetService: ProjetService,
    private avisService: AvisService,
    private publiciteService: PubliciteService,
    public router: Router,
  ) { }
  
  

  

  ngOnInit(): void {
  // AFFICHER LA LISTE DES INFORMATICIENS ET COMPTER LE NOMBRE
 this.serviceUser.AfficherListeInformaticien().subscribe(data => {
  this.informaticien = data.reverse();
  // this.nombreInformaticiens = this.informaticien.length; // à réactiver
  // console.log('Nombre d\'informaticiens:', this.nombreInformaticiens);
});

// à réactiver — nombre de projets
// this.projetService.AfficherListeProjetInformatique().subscribe(data => {
//   this.nombreDeProjets = data.length;
//   console.log('Nombre de projets:', this.nombreDeProjets);
// });

   // th
     // AFFICHER LA LISTE DES INFORMATICIENS
     this.specialiteService.AfficherListeSPecialite().subscribe(data => {
      this.specialite = data;
      console.log(this.specialite);
    });
    // AFFICHER LA LISTE DES CONNAISSANCES
    this.connaissanceService.AfficherListeConnaissance().subscribe(data => {
      this.connaissance = data;
      console.log(this.connaissance);
    });

    // AVIS APPROUVÉS (témoignages)
    this.avisService.approuves().subscribe({
      next: (data) => { this.avisApprouves = data || []; },
      error: () => { this.avisApprouves = []; }
    });

    // PUBLICITÉS ACTIVES
    this.publiciteService.actives().subscribe({
      next: (data) => { this.publicites = data || []; },
      error: () => { this.publicites = []; }
    });


// à réactiver — nombre de clients
// this.serviceUser.AfficherListeClient().subscribe(data => {
//   this.nombreDeClient = data.length;
//   console.log('Nombre de clients:', this.nombreDeClient);
// });

   //nombre informaticien 
//    this.serviceUser.AfficherListeInformaticien().subscribe(data => {
//     this.nombreInformaticiens = data;
//    console.log(this.nombreInformaticiens);
//  });
    // this.projetService.AfficherListeProjetInformatique().subscribe(
    //   (nombre: number) => {
    //     this.nombreDeProjets = nombre;
    //   },
    //   (erreur) => {
    //     console.error('Erreur lors de la récupération du nombre de projets', erreur);
    //   }
    // );
  }
  getHeaders(): any {
    throw new Error('Method not implemented.');
  }

  goToDettailProfessionnel(token: string | undefined, id?: number): Promise<boolean> {
    const slug = token || (id != null ? String(id) : null);
    if (slug) return this.router.navigate(['professionnel', slug]);
    return Promise.resolve(false);
  }

  envoyerAvis(): void {
    if (!this.avisForm.nom.trim() || !this.avisForm.email.trim() || !this.avisForm.message.trim()) {
      Swal.fire({ title: 'Champs manquants', text: 'Merci de renseigner votre nom, votre email et votre avis.', icon: 'warning', heightAuto: false });
      return;
    }
    this.avisEnvoiEnCours = true;
    this.avisService.envoyer(this.avisForm.nom.trim(), this.avisForm.email.trim(), this.avisForm.message.trim()).subscribe({
      next: (res) => {
        this.avisEnvoiEnCours = false;
        Swal.fire({ title: 'Merci !', text: res?.message || 'Votre avis a été envoyé.', icon: 'success', heightAuto: false });
        this.avisForm = { nom: '', email: '', message: '' };
      },
      error: (err) => {
        this.avisEnvoiEnCours = false;
        Swal.fire({ title: 'Erreur', text: err?.error?.message || 'Impossible d\'envoyer votre avis.', icon: 'error', heightAuto: false });
      }
    });
  }
}
function AfficherListeProjetInformatique() {
  throw new Error('Function not implemented.');
}

