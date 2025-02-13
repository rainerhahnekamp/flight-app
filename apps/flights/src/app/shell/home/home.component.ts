import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '@demo/shared/util-logger';
import { AuthService } from '@demo/shared/util-auth';
import {
  catchError,
  concatMap,
  EMPTY,
  exhaustMap,
  first,
  mergeMap,
  Observable,
  of,
  retry,
  shareReplay,
  switchMap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Flight, FlightService } from '@demo/ticketing/data';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

/**
 * TODO:
 *
 * 1. Multicasting. Self-written interval
 * 2. Error Handling
 * 3. Higher Order Operators
 * 4. Exercise
 */

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  logger = inject(LoggerService);
  auth = inject(AuthService);
  httpClient = inject(HttpClient);
  flightService = inject(FlightService);

  from = new FormControl('', { nonNullable: true });
  fromSignal = toSignal(this.from.valueChanges);
  flights = [] as Flight[];

  flights$: Observable<Flight[]> = this.from.valueChanges.pipe(
    switchMap((from) =>
      this.flightService.find(from, '').pipe(
        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      )
    )
    // retry()
    // catchError(() => of([]))
  );

  constructor() {}

  interval(milliSeconds = 1000) {
    const interval$ = new Observable<number>((subscriber) => {
      let currentValue = 0;
      const intervalId = setInterval(() => {
        console.log(`emitting ${currentValue}`);
        subscriber.next(currentValue++);
      }, milliSeconds);

      return () => clearInterval(intervalId);
    });

    return interval$.pipe(shareReplay());
  }

  counter = this.interval(1000);

  ngOnInit() {
    const url = 'https://demo.angulararchitects.io/api/airport';

    const airports$ = this.httpClient.get<string[]>(url).pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
      // share({
      //   resetOnComplete: false,
      //   resetOnRefCountZero: false,
      //   connector: () => new ReplaySubject(),
      // })
    );

    airports$
      .pipe(first())
      .subscribe((airports) => console.log('Subscription 1: %o', airports));
    airports$
      .pipe(first())
      .subscribe((airports) => console.log('Subscription 2: %o', airports));

    setTimeout(() => {
      console.log('starting 3rd subscription');
      return airports$.subscribe((airports) =>
        console.log('Subscription 3: %o', airports)
      );
    }, 1000);

    // const numbers$ = new BehaviorSubject<number>(0);
    // numbers$.subscribe((value) => console.log(value));
    // numbers$.next(1);
    // numbers$.next(2);

    // numbers$.subscribe((value) => console.log(value));
    console.log('finished...');
  }

  unsubscribeTimer() {}

  subscribeTimer() {
    this.counter.subscribe((value) =>
      console.log(`other subscription: ${value}`)
    );
  }
}
