import { inject, Injectable, OnDestroy, Signal } from '@angular/core';
import { Flight } from './model/flight';
import { HttpClient, httpResource } from '@angular/common/http';
import { Configuration } from './config';
import { first, from, lastValueFrom, Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightClient {
  readonly #http = inject(HttpClient);
  readonly #config = inject(Configuration);
  readonly #url = `${this.#config.baseUrl}/flight`;

  search(from: string, to: string) {
    return this.#http.get<Flight[]>(this.#url, { params: { from, to } });
  }

  searchByPromise(from: string, to: string) {
    return lastValueFrom(this.search(from, to));
  }

  findById(id: number) {
    return this.#http.get<Flight>(`${this.#url}/${id}`);
  }

  save(flight: Flight) {
    return this.#http.post<Flight>(this.#url, flight);
  }
}
