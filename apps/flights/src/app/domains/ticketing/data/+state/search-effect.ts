import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { searchActions } from '@demo/ticketing/data/+state/search-actions';
import { map, switchMap } from 'rxjs';
import { FlightService } from '@demo/ticketing/data';

@Injectable()
export class SearchEffects {
  actions$ = inject(Actions);
  flightService = inject(FlightService);

  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchActions.search),
      switchMap(({ from, to }) => this.flightService.find(from, to)),
      map((flights) => searchActions.searchSuccess({ flights }))
    )
  );
}
