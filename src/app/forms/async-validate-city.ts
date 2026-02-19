import {AbstractControl, AsyncValidatorFn} from "@angular/forms";
import {inject, Injectable} from "@angular/core";
import {FlightService} from "../flight-service";
import {map} from "rxjs";

@Injectable({providedIn: 'root'})
export class AsyncCityValidator {

  flightService = inject(FlightService);

  validate(control: AbstractControl) {

    return this.flightService
      .search('', '').pipe(
        map(flights => new Set(flights.map(flight => [flight.from, flight.to]).flat())),
        map(cities => cities.has(control.value) ? null : {city: true}))
  }
}

export const asyncCityValidator = () => {
  const flightService = inject(FlightService);

  return (control: AbstractControl) => {
    return flightService
      .search('', '').pipe(
        map(flights => new Set(flights.map(flight => [flight.from, flight.to]).flat())),
        map(cities => cities.has(control.value) ? null : {city: true}))
  }
}
