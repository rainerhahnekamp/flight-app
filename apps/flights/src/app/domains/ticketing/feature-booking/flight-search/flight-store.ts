import { computed, inject, Injectable, signal } from '@angular/core';
import { Flight, FlightService } from '@demo/ticketing/data';
import { addMinutes } from 'date-fns';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';

const withLoading = () =>
  signalStoreFeature(
    withState({ loading: false }),
    withMethods((store) => {
      return {
        toggleLoading() {
          patchState(store, { loading: !store.loading });
        },
      };
    }),
    withComputed((store) => {
      return {
        isLoading: computed(() => store.loading()),
      };
    })
  );

export const FlightStore = signalStore(
  withLoading(),
  withState({
    searchParams: {
      from: 'London',
      to: 'Paris',
    },
    flights: [] as Flight[],
  }),
  withMethods((store) => {
    const flightService = inject(FlightService);
    return {
      search: rxMethod<{ from: string; to: string }>(
        pipe(
          debounceTime(500),
          tap((searchParams) => {
            patchState(store, { searchParams, flights: [] });
            store.toggleLoading();
          }),
          switchMap(({ from, to }) => flightService.find(from, to)),
          tap((flights) => {
            patchState(store, { flights });
            store.toggleLoading();
          })
        )
      ),
      delay() {
        const oldFlights = store.flights();
        const oldFlight = { ...oldFlights[0] };
        const oldDate = new Date(oldFlight.date);

        const newDate = addMinutes(oldDate, 15);
        oldFlight.date = newDate.toISOString();

        patchState(store, { flights: [oldFlight, ...oldFlights.slice(1)] });
      },
    };
  }),
  withState({ delayInMinutes: 15 }),
  withComputed(({ searchParams: { from, to }, flights }) => {
    return {
      prettySearch: computed(() => `from ${from()} to ${to()}`),
      flightsCount: computed(() => flights().length),
    };
  }),
  withHooks({
    onInit(store) {
      store.search(store.searchParams());
    },
  })
);
