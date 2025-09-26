import { inject, Injectable, OnDestroy, Signal } from '@angular/core';
import { Flight } from './model/flight';
import { HttpClient, httpResource } from '@angular/common/http';
import { Configuration } from './config';
import { first, from, Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightClient implements OnDestroy {
  readonly #http = inject(HttpClient);
  readonly #config = inject(Configuration);

  private subs = [] as Subscription[];

  flights = new Subject<Flight[]>();
  // readonly #url = 'https://demo.angulararchitects.io/api/flight'

  readonly #url = `${this.#config.baseUrl}/flight`;

  search(from: string, to: string) {
    const params = { from, to };

    return this.#http.get<Flight[]>(this.#url, { params });
  }

  findById(id: Signal<number>) {
    return httpResource<Flight>(
      () => `https://demo.angulararchitects.io/api/flight/${id()}`,
    );
  }

  searchLegacy(from: string, to: string) {
    this.search(from, to).subscribe((flights) => this.flights.next(flights));
  }

  save(flight: Flight) {
    return this.#http.post<Flight>(this.#url, flight);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
