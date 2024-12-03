import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Flight } from '../model/flight';
import { FlightSearchService } from './flight-search.service';

@Injectable()
export class DefaultFlightService implements FlightSearchService {
  readonly #httpClient = inject(HttpClient);
  readonly #url = 'https://demo.angulararchitects.io/api/flight';

  search(from: string, to: string): Observable<Array<Flight>> {
    return this.#httpClient.get<Array<Flight>>(this.#url, {
      params: { from, to },
    });
  }

  save(flight: Flight): Observable<void> {
    return this.#httpClient.post<void>(this.#url, flight);
  }
}
