import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {input} from "@angular/core";


export function validateCity(allowedCities = ['London', 'Paris', 'Bratislava']): ValidatorFn {
  return (input: AbstractControl) => {
    if (allowedCities.includes(input.value)) {
      return null;
    }

    return {
      city: {
        allowedCities
      }
    }
  }
}
