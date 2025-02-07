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
  resource,
  linkedSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/ticketing/data';
import { addMinutes } from 'date-fns';
import {
  async,
  debounceTime,
  delay,
  finalize,
  from,
  interval,
  lastValueFrom,
  map,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  rxResource,
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { id } from 'date-fns/locale';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

const BASE_URL = new InjectionToken('bsae url', { factory: () => 'url' });

async function debounce(timeout = 500) {
  await new Promise((resolve) => setTimeout(() => resolve(true), timeout));
}

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
  private injector = inject(Injector);

  private flightService = inject(FlightService);

  pollDelays() {
    return { id: 1, delay: 10 };
  }

  setFligthsToVienna() {
    this.flightsResource.update((flights) => {
      if (!flights) {
        return flights;
      }

      return flights.map((flight) => ({ ...flight, from: 'Vienna' }));
    });
  }

  lastCheck = new Date();

  from = signal('Paris');
  to = signal('London');
  // flightsResource = rxResource({
  //   request: () => ({ from: this.from(), to: this.to() }),
  //   loader: () => {
  //     return interval(1000).pipe(
  //       startWith(0),
  //       switchMap(() => this.flightService.find(this.from(), this.to()))
  //     );
  //   },
  // });

  searchParameters = computed(() => ({ from: this.from(), to: this.to() }));

  flightsResource = resource({
    request: this.searchParameters,
    stream: async ({ request: { from, to }, abortSignal }) => {
      const flights = signal<{ value: Flight[] }>({ value: [] });

      const intervalId = setInterval(async () => {
        flights.set({ value: await this.flightService.findPromise(from, to) });
      }, 5000);

      abortSignal.addEventListener('abort', () => {
        clearInterval(intervalId);
      });

      return flights;
    },
  });
  flights = signal([] as Flight[]);

  flightsCount = computed(() => this.flights().length);

  prettySearch = computed(() => {
    const value = `Suche von ${this.from()} nach ${this.to()}: ${this.flightsCount()} Flüge`;
    return value;
  });

  printPrettySearch() {
    console.log(this.prettySearch());
  }

  basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });
  basketCount = computed(() => Object.keys(this.basket()).length);

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

  updateBasket(id: number) {
    // const basket = this.basket();
    this.basket.update((basket) => {
      basket[id] = true;
      console.log(basket);
      return basket;
    });
  }
}
