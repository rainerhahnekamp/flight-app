import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Flight } from './flight';
import { ConfigService } from '@demo/shared/util-config';
import { TriggerService } from '../../../trigger.service';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private triggerService = inject(TriggerService);

  #searchParams = signal({ from: '', to: '' });

  private _flights = httpResource<Flight[]>(
    () => {
      const { from, to } = this.#searchParams();
      this.triggerService.triggerSignal();

      if (from === '' && to === '') {
        return undefined;
      }

      return `https://demo.angulararchitects.io/api/flight?from=${from}&to=${to}`;
    },
    { defaultValue: [] }
  );

  createFindResource() {
    return httpResource<Flight[]>(
      () => {
        const { from, to } = this.#searchParams();
        this.triggerService.triggerSignal();

        if (from === '' && to === '') {
          return undefined;
        }

        return `https://demo.angulararchitects.io/api/flight?from=${from}&to=${to}`;
      },
      { defaultValue: [] }
    );
  }

  // flights = this._flights.asReadonly();

  find(from: string, to: string, urgent = false): Observable<Flight[]> {
    const url = `${this.configService.config.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    const params = { from, to, urgent };

    return this.http.get<Flight[]>(url, { headers, params });
  }

  findPromise(from: string, to: string, urgent = false): Promise<Flight[]> {
    return firstValueFrom(this.find(from, to, urgent));
  }

  findInResource(from: string, to: string) {
    this.#searchParams.set({ from, to });
  }

  findById(id: string): Observable<Flight> {
    const url = `${this.configService.config.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    const params = { id };

    return this.http.get<Flight>(url, { headers, params });
  }
}
