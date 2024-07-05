import {
  computed,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
} from '@angular/core';
import { Flight, FlightService } from '@demo/ticketing/data';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { withLoading } from '@demo/ticketing/feature-booking/flight-search/with-loading';

export const FlightStore = signalStore(
  { providedIn: 'root' },
  withLoading(),
  withState({
    flights: new Array<Flight>(),
    searchParams: { from: '', to: '' },
  }),
  withComputed((state) => {
    return {
      prettySearch: computed(
        () => `${state.searchParams.from()} nach ${state.searchParams.to()}`
      ),
    };
  }),
  withMethods((store) => {
    const flightService = inject(FlightService);

    return {
      connectParams: rxMethod<{
        from: string;
        to: string;
      }>(
        pipe(
          tap((searchParams) => patchState(store, { searchParams })),
          debounceTime(500),
          tap(() => store.setLoading()),
          switchMap(({ from, to }) => flightService.findPromise(from, to)),
          tap((flights) => {
            patchState(store, { flights });
            store.setLoaded();
          })
        )
      ),
    };
  })
);
