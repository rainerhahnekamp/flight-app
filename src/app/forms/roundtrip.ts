import { Directive } from '@angular/core';
import {
  AbstractControl,
  isFormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { from } from 'rxjs';
import { CityValidator } from './city';

@Directive({
  selector: 'form[roundtrip]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: Roundtrip,
      multi: true,
    },
  ],
})
export class Roundtrip implements Validator {
  validate = validateRoundtrip;
}

export function validateRoundtrip(
  control: AbstractControl
): ValidationErrors | null {
  if (!isFormGroup(control)) {
    return null;
  }

  const { from, to } = control.value;

  if (from === to) {
    return { roundtrip: true };
  }

  return null;
}
