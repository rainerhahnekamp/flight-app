import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '@demo/shared/util-logger';
import { AuthService } from '@demo/shared/util-auth';
import {
  asapScheduler,
  asyncScheduler,
  BehaviorSubject,
  catchError,
  combineLatest,
  concatMap,
  delay,
  exhaustMap,
  forkJoin,
  interval,
  map,
  mergeMap,
  Observable,
  of,
  ReplaySubject,
  scheduled,
  share,
  shareReplay,
  Subject,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  logger = inject(LoggerService);
  auth = inject(AuthService);
  httpClient = inject(HttpClient);

  constructor() {
    this.logger.debug('home', 'debug');
    this.logger.info('home', 'info');
    this.logger.error('home', 'error');
  }

  async ngOnInit() {
    // const observable = new Observable<number>((subscriber) => {
    //   console.log('starting Observable...');
    //   window.setTimeout(() => subscriber.next(1));
    // });
    //
    // observable.subscribe((value) => console.log(`Observable: ${value}`));
    // observable.subscribe((value) => console.log(`Observable: ${value}`));
    //
    // const promise = new Promise<number>((resolve) => {
    //   console.log('starting Promise...');
    //   resolve(1);
    // });
    // console.log(`Promise: ${await promise}`);

    const airports$ = this.httpClient
      .get<string[]>('http://angular.at/api/airport')
      .pipe(shareReplay());
    // const airports$ = new Observable<string[]>((subscriber) => {
    //   fetch('http://angular.at/api/airport')
    //     .then((res) => res.json())
    //     .then((response) => {
    //       subscriber.next(response);
    //       subscriber.complete();
    //     });
    //
    // }).pipe(share({ resetOnComplete: false }));

    const numbers$ = of(1).pipe(delay(750));
    const chars$ = of('a', 'b').pipe(delay(1500));
    const specialChars$ = of('%').pipe(delay(200));

    /**
     * emitting rules combineLatest
     * 1. all observable need to emit once
     * 2. whenever any observable emits, all values from all observables are emitted together
     *
     * forkJoin: waits until all complete and emits only then
     *
     * zip: emits once when all observables emitted and then never ever
     */
    zip([numbers$, chars$, specialChars$]).subscribe(
      ([value1, value2, value3]) => {
        console.log(`${value1} - ${value2} - ${value3}`);
      }
    );

    // const get$ = new Subject<string>();
    //
    // const safeGet = () => (source$: Observable<string>) =>
    //   source$.pipe(
    //     exhaustMap((url) =>
    //       this.httpClient.get<string[]>(url).pipe(catchError(() => of([])))
    //     )
    //   );
    // const response$ = get$.pipe(safeGet());
    //
    // response$.subscribe(console.log);
    //
    // get$.next('http://angular.at/api/airport?name=A');
    // get$.next('http://angular.at/api/airport?name=B');
    // get$.next('http://angular.at/api/airport?name=C');
    // get$.next('http://angular.at/api/airport?name=D');
    // window.setTimeout(
    //   () => get$.next('http://angular.at/api/airport?name=E'),
    //   1000
    // );

    // const number$ = new BehaviorSubject<number>(2);
    // console.log(number$.getValue());
    // number$.next(0);
    // number$.next(1);
    // number$.subscribe((value) => console.log(`1. sub: ${value}`));
    //
    // number$.next(2);
    // number$.subscribe((value) => console.log(`2. sub: ${value}`));
    //
    // number$.next(3);

    // const numbers$ = of(1, 2, 3, 4, 5).pipe(
    //   tap((value) => {
    //     if (value === 3) {
    //       throw new Error('3 is not allowed');
    //     }
    //   })
    // );
    //
    // numbers$.pipe(catchError(() => interval(1000))).subscribe({
    //   next: console.log,
    //   error: () => console.info('an error has happened'),
    // });
    //
    // console.log('finished');
  }
}
