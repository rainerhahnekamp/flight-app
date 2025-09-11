import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Flight } from '@demo/ticketing/data/flight';
import { computed, inject, ResourceStatus } from '@angular/core';
import { FlightService } from '@demo/ticketing/data/flight.service';
import { withDevtools, updateState } from '@angular-architects/ngrx-toolkit';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  from,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { tapResponse } from '@ngrx/operators';

export const FlightStore = signalStore(
  { providedIn: 'root' },
  withDevtools('flightSearch'),
  withState({
    searchParams: { from: 'Paris', to: 'London' },
    _loadStatus: 'idle' as ResourceStatus,
    flights: [] as Flight[],
  }),
  withProps(() => ({
    _flightService: inject(FlightService),
  })),
  withMethods((store) => ({
    search: rxMethod<{ from: string; to: string }>(
      pipe(
        distinctUntilChanged(
          (sp1, sp2) => sp1.from === sp2.from && sp1.to === sp2.to
        ),
        debounceTime(500),
        tap(() => updateState(store, 'Loading', { _loadStatus: 'loading' })),
        switchMap(({ from, to }) =>
          store._flightService.find(from, to).pipe(
            tapResponse({
              next: (flights) =>
                updateState(store, 'Flight Search', {
                  flights,
                  _loadStatus: 'resolved',
                  searchParams: { from, to },
                }),
              error: console.error,
            })
          )
        )
      )
    ),
    // async search(from: string, to: string) {
    //   const flights = await store._flightService.findPromise(from, to);
    //   updateState(store, 'Flight Search', { flights });
    // },
  })),
  withComputed((state) => {
    const flightsCount = computed(() => state.flights().length);
    return {
      flightsCount,
      isLoading: () => state._loadStatus() === 'loading',
      prettySearch: () =>
        `Search from ${state.searchParams.from()} to ${state.searchParams.to()}: ${flightsCount()} found`,
    };
  }),
  withHooks((store) => ({
    onInit() {
      store.search(store.searchParams());
    },
    onDestroy() {},
  }))
);
