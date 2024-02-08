import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  informaticiens: any[] = [];

  constructor(
    private serviceUser: UserService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    // AFFICHER LA LISTE DES INFORMATICIENS
    this.serviceUser.AfficherListeInformaticien().subscribe(data => {
      console.log("Données brutes :", data);
  
      // Trier les informaticiens par date de manière décroissante
      this.informaticiens = data.sort.slice(0, 3);
      
      console.log("Informaticiens triés :", this.informaticiens);
    });
  }
  

  goToDettailInformaticien(id: number | undefined): Promise<boolean> {
    if (id !== undefined) {
      return this.router.navigate(['profile-dev', id]);
    }
    return Promise.resolve(false);
  }
}

