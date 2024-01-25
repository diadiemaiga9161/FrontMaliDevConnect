import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteProfilsComponent } from './complete-profils.component';

describe('CompleteProfilsComponent', () => {
  let component: CompleteProfilsComponent;
  let fixture: ComponentFixture<CompleteProfilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteProfilsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteProfilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
