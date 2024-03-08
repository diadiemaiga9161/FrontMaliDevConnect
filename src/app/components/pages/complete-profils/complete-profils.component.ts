import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-complete-profils',
  templateUrl: './complete-profils.component.html',
  styleUrls: ['./complete-profils.component.scss']
})
export class CompleteProfilsComponent implements OnInit {

  
  User: any;

  searchTextSpecialite: any;
  searchTextConnaissance: any;
  connaissance: any;


    //IMAGE
    generateImageUrl(photoFileName: string): string {
      const baseUrl = URL_PHOTO;
      return baseUrl + photoFileName;
    }
      // IMAGE PAR DEFAUT USER
   handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/tiec.jpg';
  }
  constructor(
    private serviceUser: UserService,
    private specialiteService: SpecialiteService,
    private connaissanceService: ConnaissanceService,
    public router: Router,
  ) { }

  

  ngOnInit(): void {

    // AFFICHER LA LISTE DES CONNAISSANCES
    this.connaissanceService.AfficherListeConnaissance().subscribe(data => {
      this.connaissance = data;
      console.log(this.connaissance);
    });
  }

  goToDettailInformaticien(id: number | undefined): Promise<boolean> {
    if (id !== undefined) {
      return this.router.navigate(['profil-détaillé', id]);
    }
    // Gérer le cas où id est indéfini (facultatif)
    return Promise.resolve(false); // Retourner une promesse résolue avec `false` (ou une autre valeur appropriée)
  }
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }
  @ViewChild('form') form: NgForm;

  step: number = 1;
  formData: any = {};

  next(): void {
    this.step++;
  }

  previous(): void {
    this.step--;
  }

  submit(): void {
    // Vous pouvez soumettre les données ici
    console.log('Form submitted!', this.formData);
  }

  
}
