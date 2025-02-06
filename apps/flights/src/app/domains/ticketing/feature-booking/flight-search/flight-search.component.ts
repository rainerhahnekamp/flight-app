import {
  Component,
  ElementRef,
  NgZone,
  inject,
  signal,
  computed,
  untracked,
  SkipSelf,
  InjectionToken,
  Inject,
  effect,
  OnInit,
  DestroyRef,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/ticketing/data';
import { addMinutes } from 'date-fns';
import { debounceTime, from, lastValueFrom, switchMap, tap } from 'rxjs';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

const BASE_URL = new InjectionToken('bsae url', { factory: () => 'url' });

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent],
})
export class FlightSearchComponent implements OnInit {
  private element = inject(ElementRef);
  private zone = inject(NgZone);
  private injector = inject(Injector);

  private flightService = inject(FlightService, { skipSelf: true });

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        console.log(this.prettySearch());
      });
    });
  }

  pollDelays() {
    return { id: 1, delay: 10 };
  }

  lastCheck = new Date();

  // injector in effect / ausserhalb constructor
  // glitch-free

  from = signal('Paris');
  to = signal('London');
  flights = signal<Flight[]>([]);
  flightsCount = computed(() => this.flights().length);

  prettySearch = computed(() => {
    const value = `Suche von ${this.from()} nach ${this.to()}: ${this.flightsCount()} Flüge`;
    return value;
  });

  printPrettySearch() {
    console.log(this.prettySearch());
  }

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  async search() {
    const from = this.from();
    const to = this.to();

    const flightsPromise = lastValueFrom(this.flightService.find(from, to));
    this.flights.set(await flightsPromise);
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
}
