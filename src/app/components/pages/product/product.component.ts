import { Component, Input, Output, OnInit, ViewChild } from "@angular/core";


import { UserService } from "src/app/services/user/user.service";
import { SpecialiteService } from "src/app/services/specialite/specialite.service";
import { Router } from "@angular/router";
import { ProjetService } from "src/app/services/projet/projet.service";


import Swal from 'sweetalert2';
import { environment } from "src/environments/environment";
import { TypeProjetService } from "src/app/services/typeProjet/type-projet.service";

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  projet: any[] = [];
  filteredProjet: any[] = [];
  searchTerm: string = '';

  typeprojet: any;

  selectedType: string = '';  // Type actuellement sélectionné

  nombreexperience: number = 0;
  id_utilisateur: any;
  rdv: any;
  p:number=1
  experienceProfessionnelle: any;
  titre: string;
  descriptionProjet: string;
  photoProjet: string;
  datedebut: any;
  datefin: any;
  lieu: string;
  description: string;
  selectedInformaticienId: string;
  @Input("icon") public icon;
  @Output() productDetail: any;

  openSidebar: boolean = false;
  OpenFilter: Boolean = false;

  sidebaron: boolean = false;
  show: boolean = false;
  open: boolean = false;
  public listView: boolean = false;
  public col_xl_12: boolean = false;
  public col_xl_2: boolean = false;

  public col_sm_3: boolean = false;
  public col_xl_3: boolean = true;
  public xl_4: boolean = true;
  public col_sm_4: boolean = false;
  public col_xl_4: boolean = false;
  public col_sm_6: boolean = true;
  public col_xl_6: boolean = false;
  public gridOptions: boolean = true;
  public active: boolean = false;


  constructor(
    private serviceUser: UserService,
    private projetService: ProjetService,
    private specialiteService: SpecialiteService,
    private typeProjetService: TypeProjetService,
    public router: Router,
  ) {}

  ngOnInit() {
    setTimeout(() => {
     
    });


    
    // AFFICHER LA LISTE DES INFORMATICIENS
    this.typeProjetService.AfficherListeTypeProjet().subscribe(data => {
      this.typeprojet = data;
      console.log(this.typeprojet);
    });


    // Récupérer les types de projets
    this.typeProjetService.AfficherListeTypeProjet().subscribe(data => {
      this.typeprojet = data;
    });               

    // Récupérer la liste des projets
    this.projetService.AfficherListeProjetInformatique().subscribe(data => {
      this.projet = data;
      this.filteredProjet = this.projet;  // Initialiser avec tous les projets
    });
         // AFFICHER LA LISTE projet par user
   this.projetService.AfficherListeProjetInformatique().subscribe(data => {
    this.projet = data;
    console.log( this.projet);
  });
  }

   // Méthode pour filtrer les projets par type
   filterByType(type: any): void {
    this.selectedType = type.typeprojet;

    if (this.selectedType) {
      // Filtrer les projets par type sélectionné
      this.filteredProjet = this.projet.filter(projet => projet.typeprojet === this.selectedType);
    } else {
      // Si aucun type sélectionné, afficher tous les projets
      this.filteredProjet = this.projet;
    }
  }

  toggleListView(val) {
    this.listView = val;
  }


  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/amadou.jpg';
  }

  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return `${URL_PHOTO}${photoFileName}`;
  }

  sidebarToggle() {
    this.openSidebar = !this.openSidebar;
  }
  openFilter() {
    this.OpenFilter = !this.OpenFilter;
  }

  gridOpens() {
    this.listView = false;
    this.gridOptions = true;
    this.listView = false;
    this.col_xl_3 = true;

    this.xl_4 = true;
    this.col_xl_4 = false;
    this.col_sm_4 = false;

    this.col_xl_6 = false;
    this.col_sm_6 = true;

    this.col_xl_2 = false;
    this.col_xl_12 = false;
  }
  listOpens() {
    this.listView = true;
    this.gridOptions = false;
    this.listView = true;
    this.col_xl_3 = true;
    this.xl_4 = true;
    this.col_xl_12 = true;
    this.col_xl_2 = false;

    this.col_xl_4 = false;
    this.col_sm_4 = false;
    this.col_xl_6 = false;
    this.col_sm_6 = true;
  }
  grid2s() {
    this.listView = false;
    this.col_xl_3 = false;
    this.col_sm_3 = false;

    this.col_xl_2 = false;

    this.col_xl_4 = false;
    this.col_sm_4 = false;

    this.col_xl_6 = true;
    this.col_sm_6 = true;

    this.col_xl_12 = false;
  }
  grid3s() {
    this.listView = false;
    this.col_xl_3 = false;
    this.col_sm_3 = false;

    this.col_xl_2 = false;
    this.col_xl_4 = true;
    this.col_sm_4 = true;

    this.col_xl_6 = false;
    this.col_sm_6 = false;

    this.col_xl_12 = false;
  }
  grid6s() {
    this.listView = false;
    this.col_xl_3 = false;
    this.col_sm_3 = false;

    this.col_xl_2 = true;
    this.col_xl_4 = false;
    this.col_sm_4 = false;

    this.col_xl_6 = false;
    this.col_sm_6 = false;

    this.col_xl_12 = false;
  }

  openProductDetail(content: any, item: any) {
    this.productDetail = item;
  }

  openProjetDetail(content: any, projet: any): void {
    // Vous pouvez gérer l'affichage des détails du projet ici
  }

  ngDoCheck() {
    this.col_xl_12 = this.col_xl_12;
    this.col_xl_2 = this.col_xl_2;
    this.col_sm_3 = this.col_xl_12;
    this.col_xl_3 = this.col_xl_3;
    this.xl_4 = this.xl_4;
    this.col_sm_4 = this.col_sm_4;
    this.col_xl_4 = this.col_xl_4;
    this.col_sm_6 = this.col_sm_6;
    this.col_xl_6 = this.col_xl_6;
  }

search(): void {
  if (this.searchTerm) {
    this.filteredProjet = this.projet.filter(projet =>
      projet.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      projet.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  } else {
    this.filteredProjet = this.projet; // Si aucun terme de recherche, tous les projets sont affichés
  }
}


}
