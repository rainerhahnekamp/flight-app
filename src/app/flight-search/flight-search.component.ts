import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
  ChangeDetectionStrategy,
  resource,
  linkedSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { FlightCard } from '../flight-card';
import { FlightClient } from '../flight-client.service';
import { Flight, parseFlights } from '../model/flight';
import { JsonPipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';
import { parseAsync } from 'zod';
import { interval, lastValueFrom, startWith, switchMap } from 'rxjs';
import { FlightStore } from '../flight-store';
import { FormErrors } from '../form-errors';

/**
 * Agenda:
 *
 * 1. Glitch-Free Effect
 * 2. Dynamic Dependency Tracking
 * 3. Infinite Loop
 * 4. Resource
 */

export function validateNotLondon(ac: AbstractControl) {
  if (ac.value === 'London') {
    return { notLondon: true };
  }
  return null;
}

@Component({
  selector: 'app-flight-search',
  imports: [ReactiveFormsModule, FlightCard, JsonPipe, FormErrors],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent {
  // flights = httpResource(
  //   () => ({
  //     url: 'https://demo.angulararchitects.io/api/flights',
  //     params: this.searchParams(),
  //   }),
  //   {
  //     parse: parseFlights,
  //   }
  // );

  // flights = resource({
  // params: this.searchParams,
  // loader: ({ params: { from, to } }) =>
  // lastValueFrom(this.flightClient.search(from, to)),
  // });

  flightStore = inject(FlightStore);

  flights = this.flightStore.flights;

  form = inject(FormBuilder).nonNullable.group({
    from: [
      '',
      [Validators.required, Validators.minLength(3), validateNotLondon],
    ],
    to: ['', Validators.required],
  });

  from = linkedSignal(() => this.flightStore.searchParams().from);
  to = linkedSignal(() => this.flightStore.searchParams().to);

  selectedFlight: Flight | undefined;

  prettySearch = computed(() => {
    if (!this.flights.hasValue()) {
      return '';
    }

    return `${this.from()} - ${this.to()}: ${
      this.flights.value().length
    } found`;
  });

  constructor() {
    effect(() => {
      const { from, to } = this.flightStore.searchParams();
      this.form.patchValue({ from, to });
    });
  }

  basket: Record<number, boolean> = { 1: true };

  reverse() {
    if (this.flights.hasValue()) {
      this.flights.value.update((flights) => [...flights].reverse());
    }
  }

  flightClient = inject(FlightClient);

  search(): void {
    if (this.form.valid) {
      this.flightStore.setSearchParams({ from: this.from(), to: this.to() });
    }
    // this.buttonPressed.set(true);
  }

  select(flight: Flight): void {
    this.selectedFlight = structuredClone(flight);
  }

  save(flight: Flight) {
    this.flightClient.save(flight).subscribe(() => {
      this.from.set(flight.from);
      this.to.set(flight.to);

      this.search();
    });
  }

  reset() {
    this.flightStore.reset();
    this.search();
  }
}

function print(value: string | Date | { something: () => unknown }) {
  if (typeof value === 'string') {
    value.toLowerCase();
  }

  if (value instanceof Date) {
    value.getTime();
  }

  (value as { something: () => unknown }).something();

  if (typeof value === 'object' && value !== null) {
    if ('something' in value && typeof value.something === 'function') {
      value.something();
    }
  }
}
