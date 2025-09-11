import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, resource, Signal, signal } from '@angular/core';
import { find, firstValueFrom, from, Observable } from 'rxjs';
import { Flight } from './flight';
import { ConfigService } from '@demo/shared/util-config';
import { s } from '@angular/cdk/scrolling-module.d-3Rw5UxLk';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  readonly #searchParams = signal<undefined | { from: string; to: string }>({
    from: 'Paris',
    to: 'London',
  });
  searchParams = this.#searchParams.asReadonly();

  getFlights(searchParams: Signal<{ from: string; to: string }>) {
    return httpResource<Flight[]>(
      () => {
        const value = searchParams();

        if (!value) {
          return undefined;
        }

        const { from, to } = value;

        return {
          url: `https://demo.angulararchitects.io/api/flight`,
          params: {
            from,
            to,
          },
        };
      },
      {
        defaultValue: [],
      }
    );
  }

  getFlightsByResource(searchParams: () => { from: string; to: string }) {
    return resource({
      params: searchParams,
      loader: ({ params }) => {
        const { from, to } = params;

        return this.findPromise(from, to);
      },
    });
  }

  getFlightsByRxResource(searchParams: Signal<{ from: string; to: string }>) {
    return rxResource({
      params: searchParams,
      stream: ({ params }) => {
        const { from, to } = params;
        return this.find(from, to);
      },
    });
  }

  find(from: string, to: string, urgent = false): Observable<Flight[]> {
    const url = `${this.configService.config.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    const params = { from, to, urgent };

    return this.http.get<Flight[]>(url, { headers, params });
  }

  findPromise(from: string, to: string, urgent = false): Promise<Flight[]> {
    return firstValueFrom(this.find(from, to, urgent));
  }

  findById(id: string): Observable<Flight> {
    const url = `${this.configService.config.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    const params = { id };

    return this.http.get<Flight>(url, { headers, params });
  }
}
