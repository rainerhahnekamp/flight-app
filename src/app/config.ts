import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";

interface ConfigResponse {
  baseUrl: string;
}


@Injectable({providedIn: 'root'})
export class Config {
  private httpClient = inject(HttpClient)

  baseUrl = ''

  init() {
    return this.httpClient.get<ConfigResponse>('assets/config.json').pipe(tap((config) => {
      this.baseUrl = config.baseUrl;
    }))
  }
}
