import { Directive } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: 'form[roundtrip]',
  providers: [
    { provide: NG_VALIDATORS, multi: true, useExisting: RoundtripValidator },
  ],
})
export class RoundtripValidator implements Validator {
  validate(control: FormGroup): ValidationErrors | null {
    console.log('%o', control);
    const { from, to } = control.value;

    return from === to ? { roundtrip: true } : null;
  }
}
