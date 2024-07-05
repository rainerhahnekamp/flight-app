import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap } from 'rxjs';
import { ticketsActions } from './tickets.actions';
import { Flight, FlightService } from '@demo/ticketing/data';

@Injectable()
export class TicketsEffects {
  actions$ = inject(Actions);
  flightService = inject(FlightService);

  loadFlights$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ticketsActions.loadFlights), // filter
      switchMap(({ from, to }) => this.flightService.find(from, to)), // request
      map((flights) => ticketsActions.flightsLoaded({ flights })) // action
    )
  );
}

interface Actionss {
  loadFlights: Flight[];
  flightsLoaded: boolean;
}

type ReducerFn<Type> = {
  [Property in keyof Type as `set${Capitalize<Property & string>}`]: (
    value: Type[Property]
  ) => void;
} & {
  [Property in keyof Type as `get${Capitalize<
    Property & string
  >}`]: () => Type[Property];
};
//
// declare function createFeature(): ReducerFn<Actionss>;
//
// const feature = createFeature();
