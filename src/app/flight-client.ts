import {inject, Injectable} from "@angular/core";
import {Flight} from "./model/flight";
import {HttpClient} from "@angular/common/http";
import {Configuration} from "./config";

@Injectable({providedIn: 'root'})
export class FlightClient {
  readonly #http = inject(HttpClient)
  readonly #config = inject(Configuration)
  // readonly #url = 'https://demo.angulararchitects.io/api/flight'

  readonly #url = `${this.#config.baseUrl}/flight`

  search(from: string, to: string) {
    const params = {
      from, to
    };

    return this.#http.get<Flight[]>(this.#url, {params})
  }

  save(flight: Flight) {
    return this.#http.post<Flight>(this.#url, flight);
  }
}
