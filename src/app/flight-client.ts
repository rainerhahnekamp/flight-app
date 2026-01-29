import {inject, Injectable, signal} from "@angular/core";
import {Flight} from "./entities/flight";
import {HttpClient, httpResource} from "@angular/common/http";
import {Configuration} from "./configuration";
import {Observable} from "rxjs";

/**
 * config Pattern
 * Asynchronität übergehen?
 * providedIn: 'root' vs provide in bootstrapApplication
 * provide LOCALE_ID
 */


@Injectable({providedIn: 'root'})
export class FlightClient {
  readonly searchParams = signal<{ from: string, to: string }>({from: '', to: ''})

  readonly flightResource = httpResource(() => ({
    url:`${this.config.baseUrl}/flight`,
    params:this.searchParams()
  }), {defaultValue: []});

  private readonly httpClient = inject(HttpClient);
  private readonly config = inject(Configuration)

  search(from: string, to: string) {
    return this.httpClient.get<Flight[]>(`${this.config.baseUrl}/flight?from=${from}&to=${to}`)
  }

  setSearchParams(from: string, to: string, date = new Date()) {
    this.searchParams.set({from, to})
  }

  save(flight: Flight): Observable<Flight> {
    return this.httpClient.post<Flight>(`${this.config.baseUrl}/flight`, flight)
  }
}
