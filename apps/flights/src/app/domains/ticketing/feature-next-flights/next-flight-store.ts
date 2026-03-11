import {
  signalStore,
  withHooks,
  withState,
  patchState,
  withMethods,
  signalMethod,
  withComputed,
} from '@ngrx/signals';
import { Flight, FlightService } from '../data';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { FlightStore } from '../data/flight-store';
import {
  setAllEntities,
  updateEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { event, Events, withEventHandlers } from '@ngrx/signals/events';
import { appEvents } from '@demo/shared/util-common/events';

export const NextFlightStore = signalStore(
  withEntities<Flight>(),
  withComputed((state) => ({ flights: state.entities })),
  withMethods((store, flightService = inject(FlightService)) => ({
    _loadNextFlights: rxMethod<Flight | undefined>(
      pipe(
        filter((flight) => flight !== undefined),
        switchMap((flight) => flightService.find(flight.from, flight.to)),
        tap((flights) => patchState(store, setAllEntities(flights)))
      )
    ),
    _loadBySignal: signalMethod<Flight | undefined>((flight) => {
      if (flight === undefined) {
        return;
      }

      flightService.find(flight.from, flight.to).subscribe((flights) => {
        patchState(store, setAllEntities(flights));
      });
    }),
  })),
  withEventHandlers((store, events = inject(Events)) => ({
    flightSelected: events.on(appEvents.flightSelected),
  })),
  withHooks((store) => ({
    onInit() {
      const flightStore = inject(FlightStore);

      store._loadNextFlights(flightStore.selectedFlight);
    },
  }))
);
