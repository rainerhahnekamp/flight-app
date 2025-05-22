import { computed, inject, Injectable, signal } from '@angular/core';
import { Flight } from '@demo/ticketing/model/flight';
import { FlightService } from '@demo/ticketing/data';

@Injectable({ providedIn: 'root' })
export class FlightStore1 {
  // State
  readonly #state = signal({
    searchParams: { from: 'Wien', to: 'Frankfurt' },
    flights: [] as Flight[],
    selectedFlightId: undefined as number | undefined,
    basket: {} as Record<number, boolean>,
    date: new Date(),
    message: '',
  });

  // Slices
  searchParams = computed(() => this.#state().searchParams);
  from = computed(() => this.searchParams().from);
  to = computed(() => this.searchParams().to);
  flights = computed(() => this.#state().flights);
  selectedFlightId = computed(() => this.#state().selectedFlightId);
  basket = computed(() => this.#state().basket);
  date = computed(() => this.#state().date);
  message = computed(() => this.#state().message);

  // Logic
  readonly #flightService = inject(FlightService);
  async search(from: string, to: string) {
    const flights = await this.#flightService.findPromise(from, to);
    this.#state.update((state) => ({
      ...state,
      flights,
      searchParams: { from, to },
    }));
  }
  select(flight: Flight) {
    this.#state.update((state) => ({ ...state, selectedFlightId: flight.id }));
  }
  resetSearchParams() {
    this.#state.update((state) => ({
      ...state,
      searchParams: { from: 'Wien', to: 'Frankfurt' },
    }));
  }

  // Computed
  readonly prettySearch = computed(
    () =>
      `From ${this.searchParams().from} to ${this.searchParams().to}: ${
        this.flights().length
      } found`
  );
  readonly selectedFlight = computed(() => {
    const selectedId = this.selectedFlightId();
    const flights = this.flights();

    if (selectedId && flights.length > 0) {
      return flights.find((flight) => flight.id === selectedId);
    }

    return undefined;
  });
}
