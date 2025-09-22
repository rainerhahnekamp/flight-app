import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay, lastValueFrom, Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class Configuration {
  #baseUrl = ''
  get baseUrl() {
    return this.#baseUrl
  }


  #httpClient = inject(HttpClient);

  async fetchConfiguration() {
    const config = await lastValueFrom(this.#httpClient.get<{ baseUrl: string }>('/assets/config.json'))
    this.#baseUrl = config.baseUrl
  }
}
