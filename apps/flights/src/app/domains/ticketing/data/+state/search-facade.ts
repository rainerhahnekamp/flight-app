import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { searchActions } from '@demo/ticketing/data/+state/search-actions';
import { searchFeature } from '@demo/ticketing/data/+state/search-reducer';
import { selectFlightsCount } from '@demo/ticketing/data/+state/search-selectors';

@Injectable({ providedIn: 'root' })
export class FlightStore {
  readonly #store = inject(Store);

  get flights() {
    return this.#store.selectSignal(searchFeature.selectFlights);
  }

  get fligthsCount() {
    return this.#store.selectSignal(selectFlightsCount);
  }

  search(from: string, to: string) {
    this.#store.dispatch(searchActions.search({ from, to }));
  }
}
