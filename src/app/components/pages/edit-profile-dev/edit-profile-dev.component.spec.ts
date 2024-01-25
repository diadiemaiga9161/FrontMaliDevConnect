import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileDevComponent } from './edit-profile-dev.component';

describe('EditProfileDevComponent', () => {
  let component: EditProfileDevComponent;
  let fixture: ComponentFixture<EditProfileDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProfileDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
