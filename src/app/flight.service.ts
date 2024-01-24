import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createFlight, Flight } from './models/flight';
import { lastValueFrom, Observable, of } from 'rxjs';

export class DefaultFlightService implements FlightService {
  httpClient = inject(HttpClient);
  url = 'https://demo.angulararchitects.io/api/flight';

  search(from: string, to: string): Observable<Flight[]> {
    const headers = {
      Accept: 'application/json',
    };

    const params = {
      from,
      to,
    };

    return this.httpClient.get<Flight[]>(this.url, { headers, params });
  }

  searchFromPromise(from: string, to: string): Promise<Flight[]> {
    return lastValueFrom(this.search(from, to));
  }

  save(flight: Flight): Promise<Flight> {
    return lastValueFrom(this.httpClient.post<Flight>(this.url, flight));
  }
}

export class DummyFlightService implements FlightService {
  save(flight: Flight): Promise<Flight> {
    return Promise.resolve(flight);
  }

  search(from: string, to: string): Observable<Flight[]> {
    return of([createFlight(), createFlight()]);
  }

  searchFromPromise(from: string, to: string): Promise<Flight[]> {
    return lastValueFrom(this.search(from, to));
  }
}

@Injectable()
export abstract class FlightService {
  abstract search(from: string, to: string): Observable<Flight[]>;

  abstract searchFromPromise(from: string, to: string): Promise<Flight[]>;

  abstract save(flight: Flight): Promise<Flight>;
}
