import { Directive, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Directive({
  selector: '[validAirport]',
  standalone: true,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      multi: true,
      useExisting: AirportValidatorDirective,
    },
  ],
})
export class AirportValidatorDirective implements AsyncValidator {
  httpClient = inject(HttpClient);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const airport = control.value;

    return this.httpClient
      .get<string[]>('https://demo.angulararchitects.io/api/airport')
      .pipe(
        map((airports) => {
          console.log(airports);
          return airports.includes(airport) ? null : { airport: airports };
        })
      );
  }
}
