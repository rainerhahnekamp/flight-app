import { Directive, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { FlightService } from '../data';
import { type } from '@ngrx/signals';

export const validateCity = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = String(control.value);
  const allowedCities = ['Wien', 'Linz', 'Hamburg'];
  if (allowedCities.includes(value)) {
    return null;
  }

  return { city: allowedCities };
};

type AsyncValidateCityFn = (flightService: FlightService) => AsyncValidatorFn;

export const asyncValidateCity: AsyncValidateCityFn =
  (flightService) => async (control) => {
    console.log('checking value: %o', control.value);
    const availableAirports = flightService.airports;

    if (availableAirports.includes(control.value)) {
      return null;
    }

    return { asyncCity: availableAirports };
  };

@Directive({
  selector: '[city]',
  providers: [
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CityValidator,
    },
  ],
})
export class CityValidator implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return validateCity(control);
  }
}
