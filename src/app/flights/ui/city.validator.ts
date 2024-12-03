import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

const defaultCities = ['Wien', 'London', 'Paris', 'Düsseldorf'];

@Directive({
  selector: '[city]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: CityValidator, multi: true },
  ],
})
export class CityValidator implements Validator {
  @Input() city = '';

  validate(control: AbstractControl): ValidationErrors | null {
    const cities = this.city === '' ? defaultCities : this.city.split(',');
    if (cities.includes(control.value)) {
      return null;
    } else {
      return { city: cities.join(',') };
    }
  }
}

export const cityValidator: ValidatorFn = (control) => {
  if (defaultCities.includes(control.value)) {
    return null;
  } else {
    return { city: defaultCities.join(',') };
  }
};

// function createValidator(validatorFn: ValidatorFn, attributeName: string) {
//   @Directive({
//     // eslint-disable-next-line @angular-eslint/directive-selector
//     selector: `[${attributeName}]`,
//     standalone: true,
//     providers: [
//       { provide: NG_VALIDATORS, useExisting: ValidatorDirective, multi: true },
//     ],
//   })
//   class ValidatorDirective implements Validator {
//     validate(control: AbstractControl): ValidationErrors | null {
//       return validatorFn(control);
//     }
//   }
//
//   return ValidatorDirective;
// }

// export const CityValidatorDirective = createValidator(cityValidator, 'city');
