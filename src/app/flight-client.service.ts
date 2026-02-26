import { inject, Injectable, Resource, Signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Flight, parseFlights } from './model/flight';
import { HttpClient } from '@angular/common/http';
import { ConfigClient } from './config-client.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class FlightClient {
  private readonly config = inject(ConfigClient);
  http = inject(HttpClient);

  search(from: string, to: string): Observable<Flight[]> {
    const headers = {
      Accept: 'application/json',
    };

    const params = {
      from,
      to,
    };

    return this.http
      .get(`${this.config.baseUrl}/flight`, { headers, params })
      .pipe(map(parseFlights));
  }

  save(flight: Flight): Observable<void> {
    return this.http.post<void>(`${this.config.baseUrl}/flight`, flight);
  }

  findById(id: Signal<number>): Resource<Flight | undefined> {
    return rxResource({
      params: id,
      stream: ({ params }) =>
        this.http.get<Flight>(`${this.config.baseUrl}/flight/${params}`),
    });
  }
}
