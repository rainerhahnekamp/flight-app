import { Component, input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'form-errors',
  template: `
    @let inputField = this.inputField(); @if (inputField) {
    @if(inputField.hasError('required')) {
    <p>This field is required</p>
    } @if(inputField.hasError('notLondon')) {
    <p>This field cannot be London</p>
    } @if(inputField.hasError('minlength')) {
    <p>
      This field must be at least
      {{ inputField.getError('minlength').requiredLength }} characters long
    </p>
    } }
  `,
})
export class FormErrors {
  inputField = input.required<AbstractControl | null>();
}
