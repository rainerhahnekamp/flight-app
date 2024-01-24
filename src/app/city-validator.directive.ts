import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[city]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CityValidatorDirective,
    },
  ],
})
export class CityValidatorDirective implements Validator {
  @Input() allowedCities = '';
  validate(control: AbstractControl<string>): ValidationErrors | null {
    const allowedCities = this.allowedCities
      ? this.allowedCities.split(',')
      : ['Wien'];
    if (allowedCities.includes(control.value)) {
      return null;
    }

    return { city: `Nur ${allowedCities.join(', ')} erlaubt.` };
  }
}
