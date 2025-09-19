import { inject, Injectable, resource, Signal, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FlightService, toFlights } from '@demo/ticketing/data';
import { from } from 'rxjs';
import { s } from '@angular/cdk/scrolling-module.d-3Rw5UxLk';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class FlightClient {
  private readonly searchParams = signal({
    from: '',
    to: '',
  });

  flightService = inject(FlightService);

  createFlights(params: () => { from: string; to: string }) {
    return httpResource(
      () => {
        const { from, to } = params();

        if (from === '' || to === '') {
          return undefined;
        }

        return {
          url: `https://demo.angulararchitects.io/api/flight`,
          params: { from, to },
        };
      },
      {
        // defaultValue: [],
        parse: toFlights,
      }
    );
  }

  createFlightsWithResource(params: () => { from: string; to: string }) {
    return resource({
      params,
      loader: ({ params }) => {
        return this.flightService.findPromise(params.from, params.to);
      },
      defaultValue: [],
    });
  }

  createFlightsWithRxResource(params: () => { from: string; to: string }) {
    return rxResource({
      params,
      stream: ({ params }) => {
        return this.flightService.find(params.from, params.to);
      },
      defaultValue: [],
    });
  }

  // private readonly _flights = httpResource(
  //   () => ({
  //     url: `https://demo.angulararchitects.io/api/flight`,
  //     params: this.searchParams(),
  //   }),
  //   {
  //     defaultValue: [],
  //     parse: toFlights,
  //   }
  // );
  //
  // flights = this._flights.asReadonly();

  search(from: string, to: string) {
    return this.searchParams.set({ from, to });
  }

  reload() {
    // this._flights.reload();
  }
}
