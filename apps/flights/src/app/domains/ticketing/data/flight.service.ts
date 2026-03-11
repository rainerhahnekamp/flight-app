import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Flight, parseFlights } from './flight';
import { ConfigService } from '@demo/shared/util-config';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  find(from: string, to: string, urgent = false): Observable<Flight[]> {
    const url = `${this.configService.config.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    const params = { from, to, urgent };

    return this.http.get(url, { headers, params }).pipe(map(parseFlights));
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

  getResource(searchParams: () => { from: string; to: string } | undefined) {
    return httpResource(
      () => {
        const value = searchParams();

        if (value === undefined) {
          return undefined;
        }

        return {
          url: 'https://demo.angulararchitects.io/api/flight',
          params: value,
        };
      },
      {
        parse: parseFlights,
      }
    );
  }
}
