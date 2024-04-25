import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasseComponent } from './new-passe.component';

describe('NewPasseComponent', () => {
  let component: NewPasseComponent;
  let fixture: ComponentFixture<NewPasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPasseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
