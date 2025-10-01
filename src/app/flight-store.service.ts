import {
  computed,
  inject,
  Injectable,
  ResourceStatus,
  signal,
} from '@angular/core';
import { Flight } from './model/flight';
import { HttpClient, httpResource } from '@angular/common/http';
import { Configuration } from './config';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  catchError,
  debounceTime,
  EMPTY,
  empty,
  from,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { FlightSearchParams } from './model/flight-search-params';
import {
  removeEntities,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { withBasisFeature, withStatus } from './with-status';
import {
  updateState,
  withDevtools,
  withResource,
} from '@angular-architects/ngrx-toolkit';

function setLoading() {
  return { status: 'loading' as ResourceStatus, error: undefined };
}

function setError(error: unknown) {
  return { status: 'error' as ResourceStatus, error };
}

function setResolved() {
  return { status: 'resolved' as ResourceStatus, error: undefined };
}

type Car = {
  id: number;
  brand: string;
  model: string;
};

export const FlightStore = signalStore(
  { providedIn: 'root' },
  withDevtools('flights'),
  withState({
    searchParams: {
      from: 'Wien',
      to: 'Berlin',
    },
    favouriteIds: [] as number[],
  }),
  withComputed((state) => ({
    prettySearch: () =>
      `${state.searchParams.from()} - ${state.searchParams.to()}`,
  })),
  withResource((store) =>
    httpResource<Flight[]>(
      () => ({
        url: 'https://demo.angulararchitects.io/api/flight',
        params: store.searchParams(),
      }),
      { defaultValue: [] },
    ),
  ),
  withMethods((store) => ({
    search: rxMethod<FlightSearchParams>(
      pipe(
        debounceTime(500),
        tap((searchParams) =>
          updateState(store, 'set search params', { searchParams }),
        ),
      ),
    ),

    resetSearchParams() {
      patchState(store, { searchParams: { from: 'Wien', to: 'Berlin' } });
    },
  })),
);
