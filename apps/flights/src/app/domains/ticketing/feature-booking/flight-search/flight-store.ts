import { inject } from '@angular/core';
import { Flight, FlightService, toFlights } from '@demo/ticketing/data';
import { signalStore, type, withComputed, withMethods } from '@ngrx/signals';
import { debounceTime, filter, from, pipe, switchMap, tap } from 'rxjs';
import { updateState, withResource } from '@angular-architects/ngrx-toolkit';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import {
  setLoaded,
  setLoading,
} from '@demo/ticketing/feature-booking/flight-search/with-loading-status';
import { withBasicFeatures } from '@demo/ticketing/feature-booking/flight-search/with-basic-features';
import { httpResource } from '@angular/common/http';

const initialState = {
  searchParams: {
    from: 'Paris',
    to: 'London',
  },
};

export interface Airline {
  id: number;
  name: string;
  location: string;
}

export const FlightStore = signalStore(
  { providedIn: 'root' },
  withBasicFeatures(initialState, 'flights'),

  withResource((store) =>
    httpResource(
      () => {
        const { from, to } = store.searchParams();

        if (from === '' || to === '') {
          return undefined;
        }

        return {
          url: `https://demo.angulararchitects.io/api/flight`,
          params: { from, to },
        };
      },
      {
        defaultValue: [],
        parse: toFlights,
      }
    )
  ),
  withComputed(({ value, searchParams: { from, to } }) => ({
    prettySearch: () =>
      `Suche von ${from()} nach ${to()}: ${value().length} gefunden.`,
    flights: () => value(),
  })),
  withMethods((store) => {
    const searchAutocomplete = rxMethod<{ from: string; to: string }>(
      pipe(
        filter(({ from, to }) => from.length >= 3 && to.length >= 3),
        filter(
          ({ from, to }) =>
            !(
              from === store.searchParams.from() &&
              to === store.searchParams.to()
            ) || store.status() === 'idle'
        ),
        debounceTime(500),
        tap(({ from, to }) =>
          updateState(store, 'set search params', {
            searchParams: { from, to },
          })
        )
      )
    );

    return { searchAutocomplete, reload: () => store._reload() };
  })
);
