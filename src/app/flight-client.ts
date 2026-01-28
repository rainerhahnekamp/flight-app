import {inject, Injectable} from "@angular/core";
import {Flight} from "./entities/flight";
import {HttpClient} from "@angular/common/http";
import {Configuration} from "./configuration";
import {from, lastValueFrom, Observable, of} from "rxjs";

/**
 * config Pattern
 * Asynchronität übergehen?
 * providedIn: 'root' vs provide in bootstrapApplication
 * provide LOCALE_ID
 */

@Injectable({providedIn: 'root'})
export class FlightClient {
  private readonly httpClient = inject(HttpClient);
  private readonly config = inject(Configuration)

  search(from: string, to: string) {
    return this.httpClient.get<Flight[]>(`${this.config.baseUrl}/flight?from=${from}&to=${to}`)
  }

  save(flight: Flight): Observable<Flight> {
    // return this.httpClient.post<Flight>(`${this.config.baseUrl}/flight`, flight)
    return of(flight);
  }
}
