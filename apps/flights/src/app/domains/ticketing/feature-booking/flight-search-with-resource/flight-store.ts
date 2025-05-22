import { Injectable } from '@angular/core';
import { Flight } from '@demo/ticketing/model/flight';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightStore {
  readonly #flights$ = new BehaviorSubject<Flight[]>([]);
  readonly flights$ = this.#flights$.asObservable();

  search(from: string, to: string) {
    // search and set flights
  }
}
