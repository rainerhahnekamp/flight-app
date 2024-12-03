import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom, Observable, of, tap } from 'rxjs';
import { Flight } from '../model/flight';
import { FlightSearchService } from './flight-search.service';

type Cache = Record<string, Array<Flight>>;

@Injectable({ providedIn: 'root' })
export class CachedFlightSearchService {
  readonly #httpClient = inject(HttpClient);
  readonly #url = 'https://demo.angulararchitects.io/api/flight';

  cache: Cache = {};

  search(from: string, to: string): Promise<Array<Flight>> {
    const cacheKey = JSON.stringify({ from, to });

    if (cacheKey in this.cache) {
      return lastValueFrom(of(this.cache[cacheKey]));
    }

    return lastValueFrom(
      this.#httpClient
        .get<Array<Flight>>(this.#url, {
          params: { from, to },
        })
        .pipe(tap((flights) => (this.cache[cacheKey] = flights))),
    );
  }

  saveWithRxJS(flight: Flight): Observable<void> {
    return this.#httpClient.post<void>(this.#url, flight);
  }

  save(flight: Flight): Promise<void> {
    return lastValueFrom(this.saveWithRxJS(flight));
  }
}
