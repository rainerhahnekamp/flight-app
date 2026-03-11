import {
  Entity,
  withDevtools,
  withResource,
} from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withFeature,
  withState,
} from '@ngrx/signals';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { FlightService } from './flight.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Flight } from './flight';
import { withFavourites } from '@demo/shared/util-common/with-favourites';
import { withSelected } from '@demo/shared/util-common/with-selected';
import { withPersistence } from '@demo/shared/util-common/with-persistence';

export type SearchParams = {
  from: string;
  to: string;
};

const initialState = {
  searchParams: {
    from: 'Paris',
    to: 'London',
  },
  flights: [] as Flight[],
};

// Mischung lokal und global

export const FlightStore = signalStore(
  { providedIn: 'root' },
  withDevtools('flights'),
  withState(initialState),
  withResource((store, flightService = inject(FlightService)) => ({
    fligths: flightService.getResource(() => {
      const { from, to } = store.searchParams();
      if (from === '' || to === '') {
        return undefined;
      }

      return { from, to };
    }),
  })),
  withFeature((store) =>
    withSelected(
      'Flights',
      computed(() => store.fligthsValue() ?? [])
    )
  ),
  withFavourites(),
  withPersistence('flights'),
  withMethods((store, flightService = inject(FlightService)) => ({
    search: rxMethod<SearchParams>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(
          (p1, p2) => p1.from === p2.from && p1.to === p2.to
        ),
        tap((searchParams) => patchState(store, { searchParams }))
      )
    ),
    searchWithoutResource: rxMethod<SearchParams>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(
          (p1, p2) => p1.from === p2.from && p1.to === p2.to
        ),
        tap((searchParams) => patchState(store, { searchParams })),
        switchMap(({ from, to }) => flightService.find(from, to)),
        tap((flights) => patchState(store, { flights }))
      )
    ),
    reset() {
      patchState(store, initialState);
    },
    reload() {
      store._fligthsReload();
    },
  })),
  withComputed((state) => ({
    flightsCount: () => state.fligthsValue()?.length ?? 0,
    selectedFlight: state._selectedEntity,
  }))
);
