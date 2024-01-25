import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilDevComponent } from './profil-dev.component';

describe('ProfilDevComponent', () => {
  let component: ProfilDevComponent;
  let fixture: ComponentFixture<ProfilDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



