import {Component, computed, effect, inject, input, linkedSignal, signal, untracked} from '@angular/core';
import {Flight} from "../entities/flight";

import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {FlightService} from "../flight-service";
import {FlightCardComponent} from "../flight-card/flight-card.component";
import {FlightEditFormComponent} from "../flight-edit-form.component";
import {JsonPipe} from "@angular/common";
import {FlightStore} from "../flight-store";
import {validateCity} from "../forms/validate-city";
import {validateRoundtrip} from "../forms/validate-roundtrip";
import {asyncCityValidator, AsyncCityValidator} from "../forms/async-validate-city";


@Component({
  selector: 'app-flight-search',
  imports: [ReactiveFormsModule, FlightCardComponent, FlightEditFormComponent, JsonPipe],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.css',
})
export class FlightSearchComponent {
  private readonly flightStore = inject(FlightStore)
  private readonly asyncCityValidator = inject(AsyncCityValidator)
  readonly _flights = signal<Array<Flight>>([])

  readonly formBuilder = inject(FormBuilder)

  readonly formGroup = this.formBuilder.nonNullable.group({
    from: ['', [Validators.required, Validators.minLength(3)], (ac: AbstractControl) => this.asyncCityValidator.validate(ac)],
    to: ['', [Validators.required], asyncCityValidator()],
  }, {validators: [validateRoundtrip]});


  formSyncEffect = effect(() => {
    const from = this.flightStore.from();
    const to = this.flightStore.to();

    untracked(() => this.formGroup.setValue({from, to}));
  })

  readonly flights = this.flightStore.flights

  basket: Record<number, boolean> = {
    1: true
  }

  readonly message = computed(() => {
    switch (this.flights.status()) {
      case 'idle':
        return ''
      case 'loading':
        return 'Searching...'
      case 'resolved':
        return 'Search successful'
      case 'error':
        return 'Search failed'
    }

    return ''
  })


  // flights = httpResource<Flight[]>(() => ({
  //   url: 'https://demo.angulararchitects.io/api/flight',
  //   params: {from: this.from(), to: this.to()}, // -> Query Strings
  // }), {
  //   defaultValue: []
  // })

  constructor() {
    const value = this.flights.value
  }

  flightService = inject(FlightService)

  selectedFlight = signal<Flight | undefined>(undefined)

  search() {
    const {from, to} = this.formGroup.getRawValue();
    this.flightStore.setSearchParams(from, to)
  }

  selectFlight(flight: Flight) {
    this.selectedFlight.set({...flight})
  }

  editFlight(flight: Flight) {
    this.selectedFlight.set({...flight});
  }

  save(flight: Flight) {
    this.flightService.save(flight).subscribe({
      next: (flight) => {
        this.flightStore.setSearchParams(flight.from, flight.to)
        this.search()
        this.selectedFlight.set(undefined);
      }
    })

  }

  protected readonly input = input;
}
