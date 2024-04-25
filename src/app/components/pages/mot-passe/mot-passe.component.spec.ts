import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotPasseComponent } from './mot-passe.component';

describe('MotPasseComponent', () => {
  let component: MotPasseComponent;
  let fixture: ComponentFixture<MotPasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotPasseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotPasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
