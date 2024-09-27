import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap, of } from 'rxjs';
import { Flight } from '../model/flight';
import { Passenger } from '../model/passenger';
import { Booking } from '../model/booking';
import { ConfigService } from '../shared/config.service';

const headers = {
  Accept: 'application/json',
};

export interface SearchResult {
  from: string;
  to: string;
  flights: Flight[];
}

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);

  refresh(): Observable<SearchResult> {
    const from =
      localStorage.getItem('search_from') ||
      this.config.config.defaults?.search?.from;
    const to =
      localStorage.getItem('search_to') ||
      this.config.config.defaults?.search?.to;

    if (!from || !to) {
      return of({ from: '', to: '', flights: [] });
    }

    /*
    const from = localStorage.getItem('search_from');
    const to = localStorage.getItem('search_to');
    if (!from || !to) {
      return of({
        from: defaultFrom,
        to: defaultTo,
        flights: [],
      });
    }
    */

    return this._find(from, to).pipe(map((flights) => ({ from, to, flights })));
  }

  find(from: string, to: string): Observable<Flight[]> {
    localStorage.setItem('search_from', from);
    localStorage.setItem('search_to', to);

    return this._find(from, to);
  }

  private _find(from: string, to: string) {
    const params = { from, to };
    // Same as: const params = { from: from, to: to };

    return this.http.get<Flight[]>(`${this.config.config.baseUrl}/flight`, {
      headers,
      params,
    });
  }

  save(flight: Flight): Observable<Flight> {
    return this.http.post<Flight>(
      `${this.config.config.baseUrl}/flight`,
      flight,
      { headers }
    );
  }

  findPassengersByFlight(flight: Flight): Observable<Passenger[]> {
    return this.http
      .get<Booking[]>(`${this.config.config.baseUrl}/booking`, {
        params: { flightId: flight.id },
        headers,
      })
      .pipe(
        switchMap((bookings) => {
          const passengerIds = bookings.map((b) => b.passengerId);
          const opts = {
            params: {} /*{ id: passengerIds }*/,
            headers,
          };

          return this.http
            .get<Passenger[]>(`${this.config.config.baseUrl}/passenger`, opts)
            .pipe(
              map((passengers) =>
                passengers.filter((p) => passengerIds.includes(p.id))
              )
            );
        })
      );
  }
}
