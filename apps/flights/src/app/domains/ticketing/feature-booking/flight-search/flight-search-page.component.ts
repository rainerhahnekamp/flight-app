import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  linkedSignal,
  NgZone,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCard } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/ticketing/data';
import { addMinutes } from 'date-fns';
import { debounceTime, interval, map, of, pipe, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FlightClient } from '@demo/ticketing/feature-booking/flight-search/flight-client';
import { FlightStore } from '@demo/ticketing/feature-booking/flight-search/flight-store';
import { reset } from '@softarc/sheriff-core/src/lib/log/log';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { UserStore } from '@demo/ticketing/feature-booking/flight-search/user-store';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

/**
 * 1. Abfrage nur bei From Änderung ✅
 * 2. Debounce time in der reaktiven Suche ✅
 * 3. Lade nicht wenn ein Parameter leer ist ✅
 * 4. Nur Search Klick macht die Suche
 *
 */

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search-page.component.html',
  styleUrls: ['./flight-search-page.component.css'],
  imports: [CommonModule, FormsModule, FlightCard],
  providers: [UserStore],
})
export class FlightSearchPage {
  private readonly element = inject(ElementRef);
  private readonly zone = inject(NgZone);

  private readonly flightStore = inject(FlightStore);

  protected readonly from = linkedSignal(this.flightStore.searchParams.from);
  protected readonly to = linkedSignal(this.flightStore.searchParams.to);

  protected readonly flights = this.flightStore.flights;
  protected readonly status = this.flightStore.status;
  prettySearch = this.flightStore.prettySearch;
  userStore = inject(UserStore);

  private searchParams = computed(() => ({ from: this.from(), to: this.to() }));

  constructor() {
    this.flightStore.searchAutocomplete(this.searchParams);
  }

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  search(): void {
    // this.flightStore.search(this.from(), this.to());
  }

  delay(): void {
    // this.flights = this.toFlightsWithDelays(this.flights, 15);
  }

  toFlightsWithDelays(flights: Flight[], delay: number): Flight[] {
    if (flights.length === 0) {
      return [];
    }

    const oldFlights = flights;
    const oldFlight = oldFlights[0];
    const oldDate = new Date(oldFlight.date);
    const newDate = addMinutes(oldDate, delay);

    const newFlight = { ...oldFlight, date: newDate.toISOString() };

    return [newFlight, ...flights.slice(1)];
  }

  blink() {
    // Dirty Hack used to visualize the change detector
    this.element.nativeElement.firstChild.style.backgroundColor = 'crimson';

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.element.nativeElement.firstChild.style.backgroundColor = 'white';
      }, 1000);
    });

    return null;
  }

  reload() {
    this.flightStore.reload();
  }

  reset() {
    this.flightStore.reset();
    this.search();
  }
}
