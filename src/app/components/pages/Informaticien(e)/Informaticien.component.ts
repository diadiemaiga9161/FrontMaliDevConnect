import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user/user.service';
import { SpecialiteService } from 'src/app/services/specialite/specialite.service';
import { ConnaissanceService } from 'src/app/services/connaissance/connaissance.service';
import { ExperienceService } from 'src/app/services/experience/experience.service';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-informaticien',
  templateUrl: './Informaticien.component.html',
  styleUrls: ['./Informaticien.component.scss']
})
export class InformaticienComponent implements OnInit {

  User: any;
  informaticien: any;
  p:number=1
  searchTextSpecialite: any;
  searchTextConnaissance: any;
  searchText : any;
  specialite: any;
  Experience: any;
  profileImageUrl: string = ''; // Variable pour stocker le chemin de l'image de profil
  connaissance: any;
  experienceService: any;
  experience: any;
  http: any;


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

  
    //IMAGE
    generateImageUrl(photoFileName: string): string {
      const baseUrl = URL_PHOTO;
      return baseUrl + photoFileName;
    }
      // IMAGE PAR DEFAUT USER
   handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/team/amadou.jpg';
  }
  constructor(
    private serviceUser: UserService,
    private specialiteService: SpecialiteService,
    private connaissanceService: ConnaissanceService,
    public router: Router,
  ) { }

  

  ngOnInit(): void {
    // AFFICHER LA LISTE DES INFORMATICIENS
    this.serviceUser.AfficherListeInformaticien().subscribe(data => {
      this.informaticien = data;
      console.log(this.informaticien);
    });
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
    this.experienceService.AfficherListEexperienceProfessionnelle().subscribe(data => {
      this.experience = data;
      console.log(this.experience);
    });

    this.serviceUser.AfficherListeInformaticien().subscribe(data => {
      this.informaticien = data;
      console.log(this.informaticien);
    });
  }

  
     getHeaders() {
    throw new Error('Method not implemented.');
  }

  goToDettailInformaticien(id: number | undefined): Promise<boolean> {
    if (id !== undefined) {
      return this.router.navigate(['profil-détaillé', id]);
    }
    // Gérer le cas où id est indéfini (facultatif)
    return Promise.resolve(false); // Retourner une promesse résolue avec `false` (ou une autre valeur appropriée)
  }
  
  // filterSpecialite() {
  //   const selectedSpecialite = this.searchForm.get('specialite')?.value;
  
  //   this.filteredSpecialite = this.specialite.filter(user =>
  //     (!selectedSpecialite || user.specialite === selectedSpecialite)
  //   );
  
  //   this.totalPages = Math.ceil(this.filteredSpecialite.length / this.itemsPerPage);
  // }
  
  toggleListView(val) {
    this.listView = val;
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
}
