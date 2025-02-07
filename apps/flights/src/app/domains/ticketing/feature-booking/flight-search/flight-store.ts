import { computed, inject, ResourceStatus } from '@angular/core';
import { Flight, FlightService } from '../../data';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { withBasket } from '../with-basket';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withLocalStorage } from './with-local-storage';

type State = {
  searchParams: {
    from: string;
    to: string;
  };
  status: ResourceStatus;
  error?: Error;
};

const initalState: State = {
  searchParams: {
    from: 'Paris',
    to: 'London',
  },
  status: ResourceStatus.Idle,
};

export const FlightsStore = signalStore(
  // { providedIn: 'root' },
  withDevtools('flights'),
  withLocalStorage('flights'),
  withState(initalState),
  withBasket<boolean>(),
  withEntities<Flight>(),
  // withEntities({ collection: 'flights', entity: type<Flight>() }),
  withComputed((state) => ({
    flights: computed(() => state.entities()),
  })),
  withComputed((state) => ({
    _flightsCount: computed(() => state.flights().length),
  })),
  withComputed((state) => {
    return {
      prettySearch: computed(() => {
        const { from, to } = state.searchParams();
        const value = `Suche von ${from} nach ${to}: ${state._flightsCount()} Flüge`;
        return value;
      }),
    };
  }),
  withMethods((store, flightService = inject(FlightService)) => ({
    syncSearchParams: rxMethod<{ from: string; to: string }>(
      pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => patchState(store, { status: ResourceStatus.Loading })),
        switchMap(({ from, to }) =>
          flightService.find(from, to).pipe(
            tapResponse({
              next: (flights) => {
                patchState(
                  store,
                  {
                    status: ResourceStatus.Resolved,
                    searchParams: { from, to },
                  },
                  setAllEntities(flights)
                );
              },

              error: console.error,
            })
          )
        )
      )
    ),
    // search: rxMethod<void>(
    //   pipe(
    //     map(() => store.searchParams()),
    //     distinctUntilChanged(),
    //     tap(() => patchState(store, { status: ResourceStatus.Loading })),
    //     switchMap(({ from, to }) => flightService.find(from, to)),
    //     tap((flights) =>
    //       patchState(store, { flights, status: ResourceStatus.Resolved })
    //     )
    //   )
    // ),
    printPrettySearch() {
      const values = Object.values(store.basket());
    },
  }))
);
