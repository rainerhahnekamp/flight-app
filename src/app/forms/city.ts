import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { computed, Directive, input } from '@angular/core';

@Directive({
  selector: '[city]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CityValidator,
      multi: true,
    },
  ],
})
export class CityValidator implements Validator {
  city = input.required<string>();
  name = input.required<string>();

  cities = computed(() => {
    console.log(`_${this.city()}_`);
    return this.city() ? this.city() : ['Wien', 'Linz'];
  });

  validate(control: AbstractControl<string>): ValidationErrors | null {
    if (this.cities().includes(control.value)) {
      return null;
    }

    return { city: this.cities() };
  }
}

export function createValidateCity(cities = ['Wien', 'Linz']) {
  return function validateCity(
    control: AbstractControl<string>
  ): ValidationErrors | null {
    if (cities.includes(control.value)) {
      return null;
    }

    return { city: true };
  };
}
