import { computed, inject, Injectable, signal } from '@angular/core';
import { FlightClient } from './flight-client.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class FlightStore {
  flightClient = inject(FlightClient);

  private _searchParams = signal({ from: '', to: '' });

  searchParams = this._searchParams.asReadonly();

  setSearchParams(params: { from: string; to: string }) {
    this._searchParams.set(params);
  }

  flights = rxResource({
    params: () => {
      const { from, to } = this._searchParams();
      return from === '' || to === '' ? undefined : { from, to };
    },
    stream: ({ params: { from, to } }) => this.flightClient.search(from, to),
    // stream: ({ params: { from, to } }) =>
    //   interval(1000).pipe(
    //     startWith(0),
    //     switchMap(() => this.flightClient.search(from, to))
    //   ),
  });

  flightsCount = computed(() => {
    if (this.flights.hasValue()) {
      return this.flights.value().length;
    } else {
      return 0;
    }
  });

  reset() {
    this._searchParams.set({ from: '', to: '' });
  }

  setRecommendedSearch() {
    this._searchParams.set({
      from: 'Düsseldorf',
      to: 'Wien',
    });
  }
}
