import { computed, inject, ResourceStatus } from '@angular/core';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Flight, FlightService } from '../data';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  from,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { withStatus } from './with-status';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';

interface SearchParams {
  from: string;
  to: string;
}

interface FlightState {
  searchParams: SearchParams;
}

const initialState: FlightState = {
  searchParams: { from: 'New York', to: 'San Francisco' },
};

export const FlightStore = signalStore(
  { providedIn: 'root' },
  withEntities<Flight>(),
  withProps(() => ({
    name: 'flights',
    _flightService: inject(FlightService),
  })),
  withStatus(),
  withState(initialState),
  withComputed((state) => ({
    prettySearch: computed(() => {
      const { from, to } = state.searchParams();
      return `Search from ${from} to ${to}: ${state.entities().length}`;
    }),
    flights: state.entities,
  })),
  withMethods((store) => ({
    search: rxMethod<SearchParams>(
      pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((searchParams) => {
          patchState(store, { searchParams });
          store.setLoading();
        }),
        switchMap(({ from, to }) => store._flightService.find(from, to)),
        tap((flights) => {
          patchState(store, setAllEntities(flights));
          store.setResolved();
        })
      )
    ),
    oldSearch: signalMethod<SearchParams>(async ({ from, to }) => {
      const abortController = new AbortController();

      patchState(store, {
        status: ResourceStatus.Loading,
        searchParams: { from, to },
      });
      const flights = await store._flightService.findPromise(
        from,
        to,
        abortController.signal
      );

      patchState(
        store,
        { status: ResourceStatus.Resolved },
        setAllEntities(flights)
      );
    }),
    reset() {
      patchState(
        store,
        {
          searchParams: { from: 'New York', to: 'San Francisco' },
          status: ResourceStatus.Idle,
          error: undefined,
        },
        setAllEntities([] as Flight[])
      );
    },
  }))
);
