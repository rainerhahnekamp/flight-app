import { inject } from '@angular/core';
import { Flight, FlightService } from '@demo/ticketing/data';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { FlightStoreType } from './flight-store-type';
import { setAllEntities } from '@ngrx/signals/entities';
import { Booking } from '@demo/ticketing/model/booking';

export function withFlightMethods() {
  return signalStoreFeature(
    type<FlightStoreType>(),
    withMethods((store) => {
      const flightService = inject(FlightService);

      return {
        search: rxMethod<{ from: string; to: string }>(
          pipe(
            debounceTime(500),
            tap(({ from, to }) => {
              patchState(store, { searchParams: { from, to } });
            }),
            switchMap(({ from, to }) =>
              flightService.find(from, to).pipe(
                tapResponse({
                  next: (flights) => patchState(store, setAllEntities(flights)),
                  error: console.error,
                })
              )
            )
          )
        ),
        select(flight: Flight) {
          patchState(store, { selectedFlightId: flight.id });
          const bookings = new Array<Booking>();

          patchState(
            store,
            setAllEntities(bookings, { collection: 'booking' })
          );
        },
        resetSearchParams() {
          patchState(store, (state) => ({
            searchParams: { ...state.searchParams, from: 'Wien' },
          }));
        },
      };
    })
  );
}
