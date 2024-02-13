import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-complete-profils',
  templateUrl: './complete-profils.component.html',
  styleUrls: ['./complete-profils.component.scss']
})
export class CompleteProfilsComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  @ViewChild('form') form: NgForm;

  step: number = 1;
  formData: any = {};

  next(): void {
    this.step++;
  }

  previous(): void {
    this.step--;
  }

  submit(): void {
    // Vous pouvez soumettre les données ici
    console.log('Form submitted!', this.formData);
  }
}
