import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoggerService } from '@demo/shared/util-logger';
import { AuthService } from '@demo/shared/util-auth';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  concat,
  concatMap,
  exhaustMap,
  filter,
  first,
  firstValueFrom,
  interval,
  lastValueFrom,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  ReplaySubject,
  retry,
  share,
  shareReplay,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Flight } from '@demo/ticketing/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  logger = inject(LoggerService);
  auth = inject(AuthService);
  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);

  @Output() change = new EventEmitter<void>();

  fromControl = new FormControl('');
  toControl = new FormControl('Wien');
  searchResult$: Observable<{
    flights: Flight[];
    hasError: boolean;
    isLoading: boolean;
  }>;
  resetSubject = new BehaviorSubject(true);
  hasError = false;
  isLoading = false;

  constructor() {
    this.logger.debug('home', 'debug');
    this.logger.info('home', 'info');
    this.logger.error('home', 'error');

    this.change.emit();

    this.searchResult$ = combineLatest([
      this.fromControl.valueChanges,
      this.toControl.valueChanges,
    ]).pipe(
      filter(([from, to]) => Boolean(from) && Boolean(to)),
      switchMap(([from, to]) => {
        return this.httpClient
          .get<Flight[]>('http://angular.at/api/flight', {
            params: { from: from || '', to: to || '' },
          })
          .pipe(
            map((flights) => ({
              flights,
              hasError: false,
              isLoading: false,
            })),
            catchError(() => {
              return of({
                flights: [] as Flight[],
                hasError: true,
                isLoading: false,
              });
            })
          );
      })
    );
  }

  async ngOnInit() {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(console.log);
    const airports$ = new Observable<string[]>((subscriber) => {
      console.log('starting Observable...');
      fetch('http://angular.at/api/airport')
        .then((request) => request.json())
        .then((airports) => {
          subscriber.next(airports);
          subscriber.complete();
        });
    }).pipe(
      shareReplay(),
      share({ resetOnComplete: false, connector: () => new ReplaySubject() })
    );

    const number$ = new BehaviorSubject(0);
    const n = number$.getValue();
    number$.asObservable();
    number$.subscribe((value) => console.log(`subject1: ${value}`));
    number$.next(1);
    number$.next(2);
    number$.next(3);
    number$.subscribe((value) => console.log(`subject2: ${value}`));
    number$.next(4);

    // const airports$ = this.httpClient
    //   .get<string[]>('http://angular.at/api/airport')
    //   .pipe(share());

    airports$.subscribe((airports) =>
      console.log(`Subscription 1: ${airports}`)
    );
    airports$.subscribe((airports) =>
      console.log(`Subscription 2: ${airports}`)
    );

    window.setTimeout(() => {
      console.log('starting 3rd subscription...');
      airports$.subscribe((airports) =>
        console.log(`Subscription 3: ${airports}`)
      );
    }, 1000);

    console.log('finished');
  }

  refresh() {
    this.resetSubject.next(true);
  }
}
