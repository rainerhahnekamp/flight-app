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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/ticketing/data';
import { addMinutes } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { delay, interval, map, Observable, Subject } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

/**
 * 1. Glitch Free
 * 2. Infinite Loop
 * 3. Dynamic Dependency Tracking
 * 4. untracked
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

  from = signal('Paris');
  to = signal('London');
  flights = signal<Flight[]>([]);

  now$ = interval().pipe(map(() => new Date().toLocaleTimeString()));
  now = toSignal(this.now$, { initialValue: new Date().toLocaleTimeString() });
  nowObservable$ = toObservable(this.now);

  prettySearch = computed(() => {
    return `Suche von ${this.from()} nach ${this.to()}: ${
      this.flights().length
    } gefunden`;
  });

  printPrettySearch() {
    console.log(this.prettySearch());
  }

  handlePrint() {
    this.printPrettySearch();
  }

  logEffect = effect(() => {
    console.log('effect...');

    // 1. Tracking
    // this.to();

    // 2. Execution
    untracked(() => {
      if (this.to() === 'Wien') {
        this.printPrettySearch();
      }
    });
  });

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  search(): void {
    this.flightService.find(this.from(), this.to()).subscribe({
      next: (flights) => {
        this.flights.set(flights);
      },
      error: (errResp) => {
        console.error('Error loading flights', errResp);
      },
    });
  }

  delay(): void {
    this.flights.update((value) => this.toFlightsWithDelays(value, 15));
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

  showPrettySearch = signal(false);

  togglePrettySearch() {
    this.showPrettySearch.update((value) => !value);
  }
}
