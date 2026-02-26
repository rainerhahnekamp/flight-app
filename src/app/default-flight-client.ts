import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Flight} from "./model/flight";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class DefaultFlightClient {
  private readonly url = 'https://demo.angulararchitects.io/api/flight';
  http = inject(HttpClient)

  search(from: string, to: string): Observable<Flight[]> {
    const headers = {
      Accept: 'application/json',
    };

    const params = {
      from,
      to,
    };

    return this.http.get<Flight[]>(this.url, {headers, params});
  }

  save(flight: Flight): Observable<void> {
    return this.http.post<void>(this.url, flight);
  }
}
