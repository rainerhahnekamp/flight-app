import { Component, inject, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../shared/logger/logger';
import { CustomLogAppender } from '../shared/logger/custom-log-appender';
import { AuthService } from '../shared/auth/auth.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  concat,
  concatMap,
  debounce,
  debounceTime,
  delay,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  exhaustMap,
  filter,
  firstValueFrom,
  interval,
  lastValueFrom,
  map,
  mergeMap,
  Observable,
  of,
  ReplaySubject,
  retry,
  share,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Flight } from '../model/flight';
import { FlightService } from '../flight-booking/flight-search/flight.service';

function debug<Type>(prefix = '') {
  return (source$: Observable<Type>): Observable<Type> => {
    return source$.pipe(tap((value) => console.log(`${prefix}%o`, value)));
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  logger = inject(LoggerService);
  auth = inject(AuthService);
  httpClient = inject(HttpClient);
  flightService = inject(FlightService);

  online$ = interval(2000).pipe(
    startWith(0),
    debug('Online'),
    map((_) => Math.random() < 0.5),
    distinctUntilChanged(),
    map((value) => ({ value })),
    shareReplay({ refCount: true })
  );

  protected readonly formGroup = inject(FormBuilder).nonNullable.group({
    from: ['Wien'],
    to: [''],
  });
  loading = false;

  refresh$ = new BehaviorSubject(undefined as void);

  #input$ = this.formGroup.valueChanges.pipe(
    map(() => this.formGroup.getRawValue()),
    filter(({ from, to }) => from.length >= 3 && to.length >= 3),
    debounceTime(500)
  );

  flightsFromInput$ = combineLatest([this.online$, this.#input$]).pipe(
    filter(([online]) => online.value),
    map(([, input]) => input),
    distinctUntilChanged(
      (previous, current) =>
        previous.from === current.from && previous.to === current.to
    )
  );

  flights$: Observable<Flight[]> = combineLatest([
    this.flightsFromInput$,
    this.refresh$,
  ]).pipe(
    map(([input]) => input),
    tap(() => (this.loading = true)),
    switchMap(({ from, to }) =>
      this.flightService.find(from, to).pipe(catchError(() => of([])))
    ),
    tap(() => (this.loading = false)),
    debug('Flüge: ')
  );

  refresh() {
    this.refresh$.next();
  }

  ngOnInit() {
    const flights$ = new Observable<Flight[]>((subscriber) => {
      fetch('https://demo.angulararchitects.io/api/flight?from=Wien&to=')
        .then((response) => response.json())
        .then((flights) => {
          subscriber.next(flights);
        });

      setTimeout(
        () => subscriber.next([{ from: 'Berlin', to: 'London' } as Flight]),
        500
      );

      setTimeout(
        () => subscriber.next([{ from: 'München', to: 'Paris' } as Flight]),
        600
      );
    }).pipe(shareReplay({ refCount: true }));

    // const flights$ = this.httpClient
    //   .get<Flight[]>(
    //     'https://demo.angulararchitects.io/api/flight?from=Wien&to='
    //   )
    //   .pipe(share());

    // const sub1 = flights$.subscribe(console.log);
    // const sub2 = flights$.subscribe(console.log);
    //
    // setTimeout(() => {
    //   console.log('starte 3te subscription');
    //   flights$.subscribe((flights) => {
    //     console.log(flights);
    //   });
    // }, 1000);
  }
}
