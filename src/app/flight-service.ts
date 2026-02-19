import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Flight} from "./entities/flight";
import {Config} from "./config";

@Injectable({providedIn: 'root'})
export class FlightService {
  httpClient = inject(HttpClient)
  config = inject(Config)

  search(from: string, to: string) {
    return this.httpClient.get<Flight[]>(`${this.config.baseUrl}/flight`,
      {params: {from: from, to: to}})
  }

  save(flight: Flight) {
    return this.httpClient.post<Flight>(`${this.config.baseUrl}/flight`, flight)
  }
}
