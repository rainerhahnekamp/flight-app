import { computed, Injectable, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Flight } from './flight';
import {
  getState,
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { state } from '@angular/animations';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, from, pipe, tap } from 'rxjs';
import { withLocalStorageSync } from '../local-storage-sync';
import { withFavourites } from '../with-favourites';

export interface FlightWithFavourite extends Flight {
  isFavourite: boolean;
}

export interface FlightState {
  searchParams: {
    from: string;
    to: string;
  };
  _isInitial: boolean;
  basket: Record<number, boolean>;
  lastUpdate: Date;
}

const initialState: FlightState = {
  searchParams: {
    from: 'Paris',
    to: 'London',
  },
  _isInitial: true,
  basket: {},
  lastUpdate: new Date(),
};

export const FlightStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withLocalStorageSync('flights'),
  withProps((state) => {
    const _flightResource = httpResource<Flight[]>(
      () => {
        const { from, to } = state.searchParams();

        if (from === '' && to === '') {
          return undefined;
        }

        if (state._isInitial()) {
          return undefined;
        }

        return `https://demo.angulararchitects.io/api/flight?from=${from}&to=${to}`;
      },
      { defaultValue: [] }
    );
    return {
      _flightResource,
      flightResource: _flightResource.asReadonly(),
    };
  }),
  withMethods((store) => ({
    setSearchParams: signalMethod<{ from: string; to: string }>(
      ({ from, to }) =>
        patchState(store, { searchParams: { from, to }, _isInitial: false })
    ),

    reload() {
      store._flightResource.reload();
    },
  })),
  withComputed((state) => ({
    prettySearch: computed(() => {
      const { from, to } = state.searchParams();
      return `Suche von ${from} nach ${to}: ${
        state.flightResource.value().length
      } gefunden`;
    }),
    entities: computed(() => state.flightResource.value()),
  })),
  withFavourites()
);
