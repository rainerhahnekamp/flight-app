import {computed, inject, Injectable, signal} from '@angular/core';
import {rxResource} from "@angular/core/rxjs-interop";
import {FlightService} from "./flight-service";

// State Management

@Injectable({providedIn: 'root'})
export class FlightStore {
  private flightService = inject(FlightService);

  private _from = signal('London')
  private _to = signal('Paris')

  from = this._from.asReadonly()
  to = this._to.asReadonly()

  setSearchParams(from: string, to: string) {
    this._from.set(from)
    this._to.set(to)
  }

  private searchParams = computed(
    () => {
      if (!this._from() || !this._to()) {
        return undefined;
      }
      return ({from: this._from(), to: this._to()});
    })

  flights = rxResource({
    params: this.searchParams,
    defaultValue: [],
    stream: (params) => this.flightService.search(params.params.from, params.params.to)
  })

}
