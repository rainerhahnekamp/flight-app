import {
  Component,
  ElementRef,
  NgZone,
  inject,
  signal,
  computed,
  effect,
  OnInit,
  Injector,
  untracked,
  Signal,
  ResourceStatus,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCard } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/ticketing/data';
import { addMinutes } from 'date-fns';
import { delay, interval, map, Observable, of, Subject } from 'rxjs';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

/**
 * 1. Glitch-Free Effect
 * 2. Dynamic Dependency Tracking
 * 3. untracked
 * 4. Infinite Loops
 */

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search-page.component.html',
  styleUrls: ['./flight-search-page.component.css'],
  imports: [CommonModule, FormsModule, FlightCard],
})
export class FlightSearchPage {
  private readonly element = inject(ElementRef);
  private readonly zone = inject(NgZone);

  private readonly flightService = inject(FlightService);

  protected readonly from = signal('Paris');
  protected readonly to = signal('London');

  protected readonly flights = httpResource<Flight[]>(
    () => ({
      url: `https://demo.angulararchitects.io/api/flight`,
      params: {
        from: this.from(),
        to: this.to(),
      },
    }),
    {
      defaultValue: [],
    }
  );

  constructor() {}

  status = signal({
    loaded: false,
    error: undefined as unknown,
  });
  error = computed(() => this.status().error);

  prettySearch = computed(() => {
    const value = `Suche von ${this.from()} nach ${this.to()}: ${
      this.flights.value().length
    } gefunden.`;

    return value;
  });

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  _time$ = interval(1000).pipe(map(() => new Date().toLocaleTimeString()));

  time = toSignal(this._time$);
  time$ = toObservable(this.time);

  search(): void {
    // this.flightService.find(this.from(), this.to()).subscribe({
    //   next: (flights) => {
    //     this.flights.set(flights);
    //   },
    //   error: (errResp) => {
    //     console.error('Error loading flights', errResp);
    //     this.status.update((state) => ({ ...state, error: errResp }));
    //   },
    // });
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

  logSignal() {}
}
