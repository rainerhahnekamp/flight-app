import { computed, inject } from '@angular/core';
import { addMinutes } from 'date-fns';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { debounceTime, filter, pipe, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { withFlightsResource } from '@demo/ticketing/feature-booking/flight-search/with-flights-resource';
import { withFavourites } from '@demo/ticketing/feature-booking/with-favourites';
import { Flight } from '@demo/ticketing/data';
import { HttpClient, HttpClientModule } from '@angular/common/http';

function delayFlights(flights: Flight[]) {
  if (flights.length === 0) {
    return [];
  }

  const oldFlights = flights;
  const oldFlight = oldFlights[0];
  const oldDate = new Date(oldFlight.date);
  const newDate = addMinutes(oldDate, 15);

  const newFlight = { ...oldFlight, date: newDate.toISOString() };

  return [newFlight, ...flights.slice(1)];
}

export const FlightStore = signalStore(
  { providedIn: 'root' },
  withState({
    searchParams: { from: 'Wien', to: 'London' },
  }),
  withFlightsResource(),
  withFavourites(),
  withProps((store) => ({
    flights: store._flightsResource.asReadonly(),
  })),
  withMethods((store) => {
    return {
      reload() {
        store._flightsResource.reload();
      },
      setSearchParams: rxMethod<{ from: string; to: string }>(
        pipe(
          debounceTime(500),
          filter(({ from, to }) => from.length >= 3 && to.length >= 3),
          tap((searchParams) => {
            patchState(store, {
              searchParams,
            });
          })
        )
      ),
      delay(): void {
        store._flightsResource.value.update(delayFlights);
      },
      setToWien() {
        patchState(store, ({ searchParams }) => ({
          searchParams: { ...searchParams, from: 'Wien' },
        }));
        store._flightsResource.value.update((flights) =>
          flights.map((flight) => ({ ...flight, from: 'Wien' }))
        );
      },
    };
  }),
  withComputed((state) => ({
    prettySearch: computed(() => {
      const { from, to } = state.searchParams();
      const flightsCount = state.flights.value().length;
      return `Suche von ${from} nach ${to}: ${flightsCount} ${
        flightsCount === 1 ? 'Flug' : 'Flüge'
      } gefunden`;
    }),
  }))
);
