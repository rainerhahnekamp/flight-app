import { computed, inject } from '@angular/core';
import { Flight, FlightService } from '@demo/ticketing/data';
import { addMinutes } from 'date-fns';
import {
  patchState,
  signalMethod,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { withStatus } from '../with-status';
import { withLog } from './with-log';
import { withSignalStoreFeatures } from './with-signal-store-features';
import { withLocalStorageSync } from './with-local-storage-sync';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { from } from 'rxjs';

type SearchParams = {
  from: string;
  to: string;
};

type FlightState = {
  searchParams: SearchParams;
  flights: Flight[];
  lastUpdated: Date;
  basket: Record<number, boolean>;
};

const initialState: FlightState = {
  searchParams: { from: 'Graz', to: '' },
  flights: [],
  lastUpdated: new Date(),
  basket: {
    3: true,
    5: true,
  },
};
export const FlightStore = signalStore(
  withDevtools('flights'),
  withState(initialState),
  withProps(() => ({
    version: 1,
  })),
  withSignalStoreFeatures(),
  withMethods((store) => {
    const flightService = inject(FlightService);
    return {
      syncSearchParams: signalMethod<SearchParams>((searchParams) =>
        patchState(store, { searchParams })
      ),
      _syncSearchParams: (searchParams: SearchParams) => {
        patchState(store, { searchParams });
      },
      addToBasket(id: number) {
        store.log('adding to basket');
        patchState(store, (state) => ({
          basket: { ...state.basket, [id]: true },
        }));
      },
      search() {
        store.setLoading();
        const { from, to } = store.searchParams();
        flightService.find(from, to).subscribe((flights) => {
          store.setLoaded();
          patchState(store, { flights, searchParams: { from, to } });
        });
      },

      delay() {
        const flights = store.flights();
        if (flights.length === 0) {
          return;
        }

        const oldFlights = flights;
        const oldFlight = oldFlights[0];
        const oldDate = new Date(oldFlight.date);
        const newDate = addMinutes(oldDate, 15);

        const newFlight = { ...oldFlight, date: newDate.toISOString() };
        const newFlights = [newFlight, ...flights.slice(1)];
        patchState(store, { flights: newFlights });
      },
    };
  }),
  withComputed((state) => ({
    prettySearch: computed(() => {
      const { from, to } = state.searchParams();
      const value = `Search from ${from} to ${to}: ${
        state.flights().length
      } found`;
      return value;
    }),

    flightsCount: computed(() => state.flights().length),
  })),
  withHooks((store) => ({
    onInit() {
      store.search();
    },
    onDestroy() {
      // store.sync();
    },
  }))
);

// const flightStore = new FlightStore();
