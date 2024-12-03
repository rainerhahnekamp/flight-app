import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: 'input[city]',
  standalone: true,
})
export class CityValidator implements Validator {
  constructor() {
    console.log('instantiating');
  }

  validate(control: AbstractControl): ValidationErrors | null {
    console.log('Here validator %o', control);
    if (['Wien', 'London', 'Paris', 'Düsseldorf'].includes(control.value)) {
      return null;
    } else {
      return { city: 'Unerlaubte Stadt' };
    }
  }
}
