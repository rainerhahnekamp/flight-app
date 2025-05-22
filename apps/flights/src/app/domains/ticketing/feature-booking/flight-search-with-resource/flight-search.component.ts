import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  linkedSignal,
  Optional,
  resource,
  Signal,
  signal,
  SkipSelf,
  untracked,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '@demo/ticketing/ui/flight-card/flight-card.component';
import { Flight, FlightService, parseFlights } from '@demo/ticketing/data';
import { select, Store } from '@ngrx/store';
import {
  BehaviorSubject,
  debounceTime,
  from,
  interval,
  map,
  Observable,
  of,
  pipe,
  startWith,
  Subject,
  tap,
} from 'rxjs';
import { httpResource } from '@angular/common/http';
import { derivedFrom } from 'ngxtension/derived-from';
import { date } from 'zod';
import {
  rxResource,
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent],
})
export class FlightSearchComponent {
  fromDefault = signal('');
  toDefault = signal('');

  user = signal({
    id: 1,
    name: 'Konrad',
    location: { city: 'Köln', zip: '15750' },
  });

  constructor() {
    setTimeout(
      () =>
        this.user.update((value) => {
          const clone = structuredClone(value);
          // const clone = { ...value };
          clone.id = 2;
          return clone;
        }),
      1000
    );

    const locationSignal = computed(() => this.user().location);

    effect(() => console.log('effect... %o', locationSignal()));

    effect(() => this.myFrom.set(this.fromDefault()));
  }

  myFrom = signal(this.fromDefault());

  from = linkedSignal<string, string>({
    source: this.fromDefault,
    computation: (from, previous) => {
      console.log('linkedSignal...%o', previous);
      if (from === 'Köln') {
        return 'Cologne';
      }
      return previous?.value || 'Frankfurt';
    },
  });

  to = linkedSignal(this.toDefault);

  time$ = interval(1000).pipe(
    startWith(0),
    map(() => new Date())
  );

  time: Signal<Date | undefined> = toSignal(this.time$, {
    initialValue: new Date(),
  });
  _time$ = toObservable(this.time);

  toSignal<T>(value$: Observable<T>, defaultValue: T) {
    const sig = signal<T>(defaultValue);

    value$.pipe(takeUntilDestroyed()).subscribe((value) => {
      sig.set(value);
    });

    return sig;
  }

  toObservable<T>(sig: Signal<T>): Observable<T> {
    const sub = new Subject<T>();
    effect(() => {
      sub.next(sig());
    });

    return sub.asObservable();
  }

  searchParams = derivedFrom(
    { from: this.from, to: this.to },
    debounceTime(1000),
    { initialValue: { from: '', to: '' } }
  );

  flightsHttp = httpResource(
    () => {
      const { from, to } = this.searchParams();

      if (from === '' || to === '') {
        return undefined;
      }

      return {
        url: 'https://demo.angulararchitects.io/api/flight',
        params: {
          from,
          to,
        },
      };
    },
    { defaultValue: [], parse: parseFlights }
  );

  flightService = inject(FlightService);

  flightsRx = rxResource({
    request: () => {
      const { from, to } = this.searchParams();

      if (from === '' || to === '') {
        return undefined;
      }

      return { from, to };
    },
    loader: ({ request }) => {
      const { from, to } = request!;
      return this.flightService.find(from, to);
    },
    defaultValue: [],
  });

  flights = resource({
    request: () => {
      const { from, to } = this.searchParams();

      if (from === '' || to === '') {
        return undefined;
      }

      return { from, to };
    },
    loader: ({ request }) => {
      const { from, to } = request!;
      return this.flightService.findPromise(from, to);
    },
    defaultValue: [],
  });

  setDefaultsToKoelnDortmund() {
    this.fromDefault.set('Köln');
    this.toDefault.set('Dortmund');
    this.search();
  }

  selectedFlight: Flight | undefined;
  message = '';
  date = new Date();
  showPrettySearch = signal(true);

  prettySearch = computed(() => {
    if (this.flights.hasValue()) {
      return `From ${this.from()} to  ${this.to()}: ${
        this.flights.value().length
      } found`;
    }

    return 'No Result yet';
  });

  resetIfViennaEffect = effect(() => {
    if (this.from() === 'Wien') {
      untracked(() => this.printPrettySearch());
    }
  });

  printPrettySearch() {
    console.log(this.prettySearch());
  }

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  search(): void {
    // this.searchParams.set({ from: this.from(), to: this.to() });
  }

  select(f: Flight): void {
    this.selectedFlight = { ...f };
  }

  updateTime() {}

  togglePrettySearch() {
    this.showPrettySearch.update((value) => !value);
  }
}
