import { Component, computed, inject, input, signal } from '@angular/core';
import { Flight } from '../entities/flight';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlightClient } from '../flight-client';
import { FlightCard } from '../flight-card';
import { JsonPipe } from '@angular/common';
import { CityValidator, createValidateCity } from '../forms/city';
import { Roundtrip, validateRoundtrip } from '../forms/roundtrip';
import { FormErrors } from '../forms/form-errors.component';
import {
  AsyncCityValidator,
  createValidateAsync,
  ValidCity,
} from '../forms/valid-city';

@Component({
  selector: 'app-flight-search',
  imports: [
    FormsModule,
    FlightCard,
    CityValidator,
    Roundtrip,
    FormErrors,
    ValidCity,
    ReactiveFormsModule,
  ],
  templateUrl: './flight-search.component.html',
  styles: `
    .selected {
      background-color: orange;
    }
  `,
})
export class FlightSearchComponent {
  protected readonly from = signal('Wien');
  protected readonly to = signal('London');

  protected readonly prettySearch = computed(
    () => `${this.from()} to ${this.to()}`
  );

  protected readonly selectedFlight = signal<Flight | undefined>(undefined);
  protected readonly flights = signal<Flight[]>([]);

  private readonly flightClient = inject(FlightClient);
  private readonly asyncCityValidator = inject(AsyncCityValidator);

  protected form = inject(FormBuilder).nonNullable.group(
    {
      from: [
        'Wien',
        [Validators.required, createValidateCity()],
        [
          (ac: AbstractControl<string>) =>
            this.asyncCityValidator.validateAsync(ac),
        ],
      ],
      to: [
        'London',
        [Validators.required, createValidateCity(['Eisenstadt'])],
        [
          (ac: AbstractControl<string>) =>
            this.asyncCityValidator.validateAsync(ac),
        ],
      ],
    },
    { validators: [validateRoundtrip] }
  );

  basket: Record<number, boolean> = {
    115: false,
    121: true,
  };
  protected email = '';

  constructor() {
    // this.form.setValue({ from: 'Wien', to: 'London' });
    this.search();
  }

  search() {
    this.flightClient.search(this.from(), this.to()).subscribe((flights) => {
      this.flights.set(
        flights.map((flight) => ({
          ...flight,
          airline: { name: 'Austrian', code: 'AUA' },
        }))
      );
    });
  }

  selectFlight(flight: Flight) {
    this.selectedFlight.set(structuredClone(flight));
  }

  protected save(flight: Flight) {
    this.flightClient.save(flight).subscribe(() => {
      this.from.set(flight.from);
      this.to.set(flight.to);
      this.search();
      this.selectedFlight.set(undefined);
    });
  }

  protected readonly input = input;
}

class Person {
  firstname: string;
  lastname: string;

  constructor(firstname: string, lastname: string) {
    this.firstname = firstname;
    this.lastname = lastname;
  }

  introduce() {
    return `Hello, my name is ${this.firstname} ${this.lastname}`;
  }
}
