import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Flight, FlightService } from '@demo/ticketing/data';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { withLocalStorageSync } from './with-local-storage-sync';

export interface FlightState {
  from: string;
  to: string;
  flights: Flight[];
}

export const FlightStore = signalStore(
  withLocalStorageSync('flightStore', false),
  withState<FlightState>({ to: 'Wien', from: 'London', flights: [] }),
  withMethods((store) => {
    const flightService = inject(FlightService);

    return {
      updateFrom(from: string) {
        patchState(store, { from });
      },
      updateTo(to: string) {
        patchState(store, { to });
      },
      search: rxMethod<{ from: string; to: string }>(
        pipe(
          tap((searchParams) => patchState(store, searchParams)),
          debounceTime(500),
          switchMap(({ from, to }) => flightService.find(from, to)),
          tapResponse({
            next(flights) {
              patchState(store, { flights });
              store.sync();
            },
            error: console.error,
          })
        )
      ),
    };
  }),
  withComputed((state) => {
    return {
      prettySearch: computed(() => `${state.from()} - ${state.to()}`),
    };
  }),
  withHooks((store) => {
    return {
      onInit() {
        if (store.syncFromLocalStorage()) {
          console.log('loading from localStorage');
          return;
        }

        store.search({ from: store.from(), to: store.to() });
      },
    };
  })
);
