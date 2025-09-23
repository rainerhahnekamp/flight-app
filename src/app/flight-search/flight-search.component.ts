import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Flight } from '../model/flight';
import { FormsModule } from '@angular/forms';
import { FlightClient } from '../flight-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Card } from '../card.component';
import { DatumShower } from './datum-shower';
import { FlightSearchParams } from '../model/flight-search-params';
import { FlightSearchFormly } from '../flight-search-formly';

/**
 * 1. Config with AppInitializer
 * 2. Search with automatic research and optimistic updates
 * 3. async und resource
 */

const initialSearchParams = { from: 'London', to: 'Paris' };
// Object.freeze(initialSearchParams);

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [FormsModule, JsonPipe, Card, DatumShower, FlightSearchFormly],
})
export class FlightSearchComponent {
  protected readonly from = signal('London');
  protected readonly to = signal('Paris');
  protected readonly searchParams = signal(initialSearchParams, {
    equal: () => false,
  });
  protected readonly flights = signal<Flight[]>([]);
  protected readonly selectedFlight = signal<Flight | undefined>(undefined);
  protected readonly message = signal('');

  readonly #flightClient = inject(FlightClient);

  readonly basket: Record<number, boolean> = {
    137: true,
    138: true,
    1373: true,
  };

  // protected flights = rxResource({
  //   params: () => ({ from: this.from(), to: this.to() }),
  //   stream: ({ params }) => this.#flightClient.search(params.from, params.to),
  //   defaultValue: [],
  // });

  prettySearch = computed(() => {
    return `Von ${this.from()} nach ${this.to()}: ${this.flights().length} gefunden`;
  });

  destroyRef = inject(DestroyRef);

  search(searchParams: FlightSearchParams): void {
    const { from, to } = searchParams;
    this.message.set('');
    this.selectedFlight.set(undefined);

    this.#flightClient
      .search(from, to)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (flights) => {
          this.flights.set(flights);
        },
        error: (errResp) => {
          console.error('Error loading flights', errResp);
        },
      });
  }

  save(): void {
    const selectedFlight = this.selectedFlight();
    if (!selectedFlight) {
      return;
    }

    this.flights.update((flights) =>
      flights.map((flight) => {
        if (flight.id === selectedFlight.id) {
          return selectedFlight;
        } else {
          return flight;
        }
      }),
    );
    this.selectedFlight.set(undefined);

    this.#flightClient.save(selectedFlight).subscribe({
      next: (flight) => {
        this.message.set('Update successful!');
        this.from.set(flight.from);
        this.to.set(flight.to);
        this.search(this.searchParams());
      },
      error: (errResponse) => {
        this.message.set('Error on updating the Flight');
        console.error(this.message, errResponse);
      },
    });
  }

  select(flight: Flight): void {
    this.selectedFlight.set({ ...flight });
  }

  modifyBasket(id: number, selected: boolean) {
    this.basket[id] = selected;
  }
}
