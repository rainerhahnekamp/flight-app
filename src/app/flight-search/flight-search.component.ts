import {Component, computed, inject, signal} from '@angular/core';
import {AsyncPipe, DatePipe, JsonPipe} from '@angular/common';
import {Flight} from '../model/flight';
import {FormsModule} from '@angular/forms';
import {FlightClient} from "../flight-client";
import {from, lastValueFrom, of, Subject, switchMap} from "rxjs";
import {rxResource} from "@angular/core/rxjs-interop";
import * as stream from "node:stream";

/**
 * 1. Config with AppInitializer
 * 2. Search with automatic research and optimistic updates
 * 3. async und resource
 */

@Component({
  selector: 'app-flight-search',
  imports: [FormsModule, DatePipe, JsonPipe],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent {
  protected from = signal('London')
  protected to = signal('Paris');
  protected selectedFlight = signal<Flight | undefined>(undefined)
  protected message = signal('')

  readonly #flightClient = inject(FlightClient)

  protected flights = rxResource({
    params: () => ({from: this.from(), to: this.to()}),
    stream: ({params}) => this.#flightClient.search(params.from, params.to),
    defaultValue: []
  })

  prettySearch = computed(() => {
    return `Von ${this.from()} nach ${this.to()}: ${this.flights.value().length} gefunden`;
  });

  search(): void {
    this.message.set('')
    this.selectedFlight.set(undefined)
    // this.searchParams.set({from: this.from(), to: this.to()})

    // this.#flightClient.search(this.from(), this.to()).subscribe({
    //   next: (flights) => {
    //     this.flights.set(flights)
    //   },
    //   error: (errResp) => {
    //     console.error('Error loading flights', errResp);
    //   },
    // });
  }

  save(): void {
    const selectedFlight = this.selectedFlight()
    if (!selectedFlight) {
      return;
    }

    this.flights.update(flights => flights.map(flight => {
      if (flight.id === selectedFlight.id) {
        return selectedFlight;
      } else {
        return flight;
      }
    }))
    this.selectedFlight.set(undefined)

    this.#flightClient.save(selectedFlight).subscribe({
      next: (flight) => {
        this.message.set('Update successful!')
        this.from.set(flight.from)
        this.to.set(flight.to)
        this.search();
      },
      error: (errResponse) => {
        this.message.set('Error on updating the Flight')
        console.error(this.message, errResponse);
      },
    });
  }

  select(flight: Flight): void {
    this.selectedFlight.set({...flight})
  }
}
