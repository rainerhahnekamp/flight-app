import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {lastValueFrom} from "rxjs";

@Injectable({providedIn: 'root'})
export class Configuration {
  baseUrl = ''

  private httpClient = inject(HttpClient);

  async init() {
    const response = await lastValueFrom(this.httpClient.get<{ baseUrl: string }>('/assets/config.json'))
    this.baseUrl = response.baseUrl
  }
}
