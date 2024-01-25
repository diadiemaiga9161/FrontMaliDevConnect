import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profil-dev',
  templateUrl: './profil-dev.component.html',
  styleUrls: ['./profil-dev.component.scss']
})
export class ProfilDevComponent implements OnInit {


  selectedTab : string = 'profil'


  constructor() { }

  ngOnInit(): void {
  }

  

  changeTab(tab :  string) {
    this.selectedTab= tab;
}

isTabActive(tab :  string) : boolean {
  return this.selectedTab=== tab;
}

}
