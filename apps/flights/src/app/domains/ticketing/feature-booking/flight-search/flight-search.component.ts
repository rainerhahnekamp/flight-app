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
  resource,
  Signal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  isFormGroup,
  ValidatorFn,
} from '@angular/forms';
import {
  form,
  FormField,
  min,
  required,
  SchemaPath,
  validate,
  validateAsync,
  validateStandardSchema,
  debounce,
} from '@angular/forms/signals';
import { NumberSelectorField } from '@demo/shared/ui-common/number-selector-field';
import { Flight, FlightService } from '@demo/ticketing/data';
import { FlightStore, SearchParams } from '@demo/ticketing/data/flight-store';
import { addMinutes } from 'date-fns';

import { BehaviorSubject, interval, map, Observable, startWith } from 'rxjs';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import z from 'zod';

const validateRoundtrip: ValidatorFn = (control: AbstractControl) => {
  if (!isFormGroup(control)) {
    return null;
  }

  const { from, to } = control.value;
  return from === to ? { roundTrip: true } : null;
};

const searchParamsSchema = z
  .object({
    from: z.string().nonempty('Von muss ausgefüllt sein'),
    to: z.string().nonempty('Nach muss ausgefüllt sein'),
    priority: z.number().min(1, 'Priorität muss mindestens 1 sein'),
  })
  .refine((data) => data.from !== data.to, {
    message: 'Von und Nach müssen verschieden sein',
  });

type SearchParamsForForm = {
  from: string;
  to: string;
  priority: number;
};

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
  imports: [
    JsonPipe,
    FormsModule,
    FlightCardComponent,
    FormField,
    NumberSelectorField,
  ],
})
export class FlightSearchComponent {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  flightStore = inject(FlightStore);
  flightService = inject(FlightService);

  searchParams = linkedSignal<SearchParams, SearchParamsForForm>({
    source: () => this.flightStore.searchParams(),
    computation: (source, previousValue) => {
      return { ...source, priority: previousValue?.value.priority ?? 0 };
    },
  });

  searchForm = form(this.searchParams, (path) => {
    validateStandardSchema(path, searchParamsSchema);
    validateAsync(path.from, {
      params: (ctx) => ctx.value(),
      factory: (params) => {
        return this.flightService.getResource(() => ({
          from: params() ?? '',
          to: '',
        }));
      },
      onSuccess: (flights) =>
        flights.length > 0
          ? undefined
          : { kind: 'noFlights', message: 'Keine Flüge gefunden' },
      onError: (error) => {
        return { kind: 'error', message: (error as Error).message };
      },
    });

    debounce(path.from, 300);
  });

  suggestion = resource({
    params: () => {
      const from = this.searchForm.from();
      console.log('running from');
      if (from.valid()) {
        return undefined;
      }

      console.log('checkin for async error');
      const hasAsyncFailed = from
        .errors()
        .some((error) => error.kind === 'noFlights');

      if (!hasAsyncFailed) {
        return undefined;
      }

      console.log('starting resource');
      return from.value();
    },
    loader: () => Promise.resolve(['Punitz', 'Badersdorf']),
  });

  prettySearch = computed(() => {
    const value = `Suche von ${this.searchParams().from} nach ${
      this.searchParams().to
    }: ${this.flights.value()?.length}`;
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

  // debouncedSearchParams = derivedFrom(
  //   this.searchParams(),
  //   pipe(debounceTime(500)),
  //   { initialValue: { from: '', to: '', priority: 1 } }
  // );

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
    this.flightStore.search(this.searchParams);
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
    this.searchForm().reset();
    this.flightStore.reset();
  }
}
