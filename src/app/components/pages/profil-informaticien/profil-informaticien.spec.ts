import { ComponentFixture, TestBed } from '@angular/core/testing';

import { profilInformaticienComponent } from './profil-informaticien.component';

describe('ProfilInformaticienComponent', () => {
  let component: profilInformaticienComponent;
  let fixture: ComponentFixture<profilInformaticienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ profilInformaticienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(profilInformaticienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



