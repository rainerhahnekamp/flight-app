import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Config, initConfig } from './config';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private http = inject(HttpClient);
  private _config = initConfig;

  get config(): Config {
    return { ...this._config };
  }

  loadConfig() {
    return this.http.get<Config>('./assets/config.json').pipe(
      tap((cfg) => {
        this._config = cfg;
      })
    );
  }
}
