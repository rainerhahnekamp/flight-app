import { signalStore, withComputed, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { Flight } from '@demo/ticketing/model/flight';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { inject } from '@angular/core';
import { flightEvents } from '@demo/ticketing/data/flight-events';
import { FlightService } from '@demo/ticketing/data/flight.service';
import { debounceTime, map, switchMap } from 'rxjs';
import { payload } from '@angular-architects/ngrx-toolkit';

export const ReduxFlightStore = signalStore(
  { providedIn: 'root' },
  withState({
    searchParams: { from: 'Wien', to: 'Frankfurt' },
  }),
  withEntities<Flight>(),
  withComputed(({ entities }) => ({ flights: entities })),
  withEffects(() => {
    const events = inject(Events);
    const flightService = inject(FlightService);

    return {
      search$: events.on(flightEvents.search).pipe(
        debounceTime(1000),
        switchMap(({ payload: { from, to } }) => flightService.find(from, to)),
        map((flights) => flightEvents.searched(flights))
      ),
    };
  }),
  withReducer(
    on(flightEvents.searched, ({ payload: flights }) => setAllEntities(flights))
  )
);
