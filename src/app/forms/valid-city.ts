import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { computed, Directive, inject, Injectable, input } from '@angular/core';
import { FlightClient } from '../flight-client';
import { map, tap } from 'rxjs';

@Directive({
  selector: '[city]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: ValidCity,
      multi: true,
    },
  ],
})
export class ValidCity implements AsyncValidator {
  flightClient = inject(FlightClient);

  validate(control: AbstractControl<string>) {
    console.log('async validator');
    return this.flightClient.search('', '').pipe(
      map((flights) => {
        return flights.some((flight) => flight.from === control.value)
          ? null
          : { validCity: true };
      }),
      tap(console.log)
    );
  }
}

export function createValidateAsync(flightClient: FlightClient) {
  // const flightClient = inject(FlightClient);

  return function validateAsync(control: AbstractControl<string>) {
    return flightClient.search('', '').pipe(
      map((flights) => {
        return flights.some((flight) => flight.from === control.value)
          ? null
          : { validCity: true };
      }),
      tap(console.log)
    );
  };
}

@Injectable({ providedIn: 'root' })
export class AsyncCityValidator {
  flightClient = inject(FlightClient);

  validateAsync(control: AbstractControl<string>) {
    return this.flightClient.search('', '').pipe(
      map((flights) => {
        return flights.some((flight) => flight.from === control.value)
          ? null
          : { validCity: true };
      }),
      tap(console.log)
    );
  }
}
