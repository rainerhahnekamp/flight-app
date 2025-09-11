import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  linkedSignal,
  NgZone,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/ticketing/data';
import { addMinutes } from 'date-fns';
import { debounceTime, of, pipe, Subject, tap } from 'rxjs';
import { derivedFrom } from 'ngxtension/derived-from';
import { FlightStore } from '@demo/ticketing/data/flight-store';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

/**
 * 1. Glitch-Free Effect
 * 2. Dynamic Dependency Tracking
 * 3. Untracked
 * 4. Infinite Loops
 *
 */

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent],
})
export class FlightSearchComponent {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  private flightService = inject(FlightService);
  private flightStore = inject(FlightStore);

  protected readonly from = linkedSignal(this.flightStore.searchParams.from);
  protected readonly to = linkedSignal(this.flightStore.searchParams.to);

  constructor() {
    this.flightStore.search(
      computed(() => ({ from: this.from(), to: this.to() }))
    );
  }

  flights = this.flightStore.flights;
  flightsCount = this.flightStore.flightsCount;
  prettySearch = this.flightStore.prettySearch;

  numberEmitter = new Subject<number>();
  currentNumber = 1;

  search(): void {
    // this.flightStore.search(this.searchParams().from, this.searchParams().to);
  }

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

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

  updateFrom() {}

  reload() {}

  emitNumber() {
    this.numberEmitter.next(this.currentNumber++);
  }
}
