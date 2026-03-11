import { mapToResource } from '@angular-architects/ngrx-toolkit';
import { JsonPipe } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  linkedSignal,
  NgZone,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Flight } from '@demo/ticketing/data';
import { FlightStore } from '@demo/ticketing/data/flight-store';
import { addMinutes } from 'date-fns';
import { derivedFrom } from 'ngxtension/derived-from';
import {
  BehaviorSubject,
  debounceTime,
  interval,
  map,
  Observable,
  pipe,
  startWith,
} from 'rxjs';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { getState, watchState } from '@ngrx/signals';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

/**
 * 1. Glitch-Free Effect
 * 2. Dynamic Dependency Tracking
 * 3. Untracked
 * 4. input/output/model
 */

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [JsonPipe, FormsModule, FlightCardComponent],
})
export class FlightSearchComponent {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  flightStore = inject(FlightStore);

  from = linkedSignal({
    source: this.flightStore.searchParams,
    computation: (source) => {
      if (source === undefined) {
        return '';
      }

      return source.from;
    },
  });
  to = linkedSignal(() => this.flightStore.searchParams()?.to ?? '');

  searchParams = signal<{ from: string; to: string } | undefined>(undefined);

  prettySearch = computed(() => {
    const value = `Suche von ${this.from()} nach ${this.to()}: ${
      this.flights.value()?.length
    }`;
    return value;
  });

  time$ = interval(1000).pipe(
    startWith(0),
    map(() => new Date().toLocaleTimeString())
  );

  time: Signal<string> = toSignal(this.time$, { initialValue: '' });

  anotherTime$ = this.toObservable(this.time);

  toObservable(value: Signal<string>) {
    const subject = new BehaviorSubject(value());
    const injector = inject(Injector);
    const destroyRef = injector.get(DestroyRef);

    destroyRef.onDestroy(() => subject.complete());
    effect(() => subject.next(value()), { injector });

    return subject.asObservable();
  }

  toSignal(value$: Observable<string>) {
    const value = signal<string | undefined>(undefined, { debugName: 'time' });
    value$.pipe(takeUntilDestroyed()).subscribe({ next: (v) => value.set(v) });
    return value;
  }

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  person = signal({
    id: 1,
    name: 'Johannes',
    lastName: 'Maier',
    metadata: {
      birthday: new Date(),
    },
    address: {
      city: 'Wien',
      zip: '1060',
    },
  });

  searchParamsSignal = derivedFrom(
    {
      from: this.from(),
      to: this.to(),
    },
    pipe(debounceTime(500)),
    { initialValue: { from: '', to: '' } }
  );

  // flights = rxResource({
  //   params: this.searchParams,
  //   stream: ({ params: { from, to } }) => this.flightService.find(from, to)
  // })

  // flights = resource({
  //   params: () => ({ from: this.from(), to: this.to() }),
  //   loader: ({ params, abortSignal }) => {
  //     abortSignal.addEventListener('abort', () => console.log('abbruch'))
  //     return this.flightService.findPromise(params.from, params.to)
  //   }
  // })

  /**
   * zod
   *
   */

  flights = mapToResource(this.flightStore, 'fligths');

  // status = signal<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  // error = signal<Error | undefined>(undefined)

  constructor() {
    effect(() => {
      const from = this.from();
      const to = this.to();

      untracked(() => this.flightStore.search({ from, to }));
    });
  }

  // constructor() {
  //   effect(() => {
  //     const from = this.from();
  //     const to = this.to();

  //     untracked(() => {
  //       this.status.set('loading')
  //       this.error.set(undefined)

  //       this.flightService.find(from, to).pipe(first()).subscribe({
  //         next: (flights) => {
  //           this.flights.set(flights)
  //           this.status.set('loaded')
  //         },
  //         error: (errResp) => {
  //           console.error('Error loading flights', errResp);
  //           this.status.set('error')
  //           this.error.set(errResp)
  //         },
  //       })
  //     })
  //   })
  // }

  address = computed(() => this.person().address);

  // searchParams$ = new BehaviorSubject({ from: '', to: '' })

  // flights$: Observable<Flight[]> = this.searchParams$.pipe(
  // switchMap(({ from, to }) => this.flightService.find(from, to))
  // )

  search() {
    // this.flightStore.search(this.from(), this.to())
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

  handleReset() {
    this.flightStore.reset();
    console.log(`Anzahl der Flüge: ${this.flightStore.flightsCount()}`);
    console.log(`Suche wurde geresettet: ${this.from()} nach ${this.to()}`);
    console.log(`Suche im FlightStore: ${this.flightStore.searchParams()}`);
  }
}
