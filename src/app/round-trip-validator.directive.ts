import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: 'form[roundTrip]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: RoundTripValidatorDirective,
    },
  ],
})
export class RoundTripValidatorDirective implements Validator {
  validate(
    control: AbstractControl<{ from: string; to: string }>
  ): ValidationErrors | null {
    return control.value.from === control.value.to ? { roundtrip: true } : null;
  }
}
