import {Flight} from '@demo/ticketing/data/flight';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {FlightService} from '@demo/ticketing/data/flight.service';
import {computed, inject} from '@angular/core';
import {addMinutes} from 'date-fns';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/component-store';

export type FlightsState = {
  params: { from: string; to: string };
  flights: Flight[];
  expandedIds: number[]
};

const initialState: FlightsState = {
  params: {from: 'Wien', to: 'London'},
  flights: [],
  expandedIds: []
};

const withLoading = () =>
  signalStoreFeature(
    withState({isLoading: true}),
    withMethods((state) => {
      return {
        toggle() {
          const isLoading = !state.isLoading();
          patchState(state, {isLoading});
        },
      };
    })
  );

export const FlightsStore = signalStore(
  withState(initialState),
  withLoading(),
  withMethods((state) => {
    const flightService = inject(FlightService);

    return {
      search: rxMethod<{ from: string; to: string }>(
        pipe(
          tap(() => state.toggle()),
          debounceTime(500),
          tap(() => state.toggle()),
          switchMap((params) => flightService.find(params.from, params.to)),
          tap(() => patchState(state, {isLoading: false})),
          tapResponse(
            (flights) => patchState(state, {flights}),
            console.error
          )
        )
      ),
      delay() {
        const oldFlight = state.flights()[0];
        const oldDate = new Date(oldFlight.date);

        const newDate = addMinutes(oldDate, 15);
        const newFlight: Flight = {...oldFlight, date: newDate.toISOString()};

        patchState(state, {
          flights: [newFlight, ...state.flights().slice(1)],
        });
      },
      toggleExpandState(id: number) {
        if (state.expandedIds().includes(id)) {
          patchState(state, {
            expandedIds: state.expandedIds().filter((i) => i !== id),
          });
        }
        else {
          patchState(state, {
            expandedIds: [...state.expandedIds(), id],
          });
        }
      }
    };
  }),
  withComputed((state) => {
    return {
      prettyFlight: computed(
        () => `Flug von ${state.params.from()} nach ${state.params.to()}`
      ),
      flightCount: computed(() => state.flights().length),
      flightsWithExpanded: computed(() => {
        const expadedIds = state.expandedIds();
        return state.flights().map(flight => ({...flight, isExpanded: expadedIds.includes(flight.id)}));
      })
    };
  })
);
