import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
  untracked,
  viewChild,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../model/flight';
import { FormsModule, NgForm } from '@angular/forms';
import { FlightService } from './flight.service';
import { CityPipe } from '../../shared/city.pipe';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import {
  catchError,
  combineLatest,
  debounceTime,
  filter,
  interval,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';

export function toPrettyDate(date: Date) {
  return date.toISOString();
}

// - signal
// - direkte Zugriff über TypeScript
// - Zugriff über reaktiven Kontext: Template, Effekt
// - Double Signal Binding = banana box syntax support
// - computed/signal zählt nicht zum reaktiven Kontext, sondern wird darin verwendet
// - Glitch-Free = asynchrone Abarbeitung (in der Change Detection), gilt nur in Reactive Context
// - kein Glitch-Free bei aktivem Zugriff auf computed (effect (prettySearch) geht nicht)
// - Dynamic Dependency Tracking
// - takeUntilDestroy mit Injection Context automatisch, ansonsten mit DestroyRef
// - RxJs optional weil keine Garantie für Wert (synchron) bzw. glitch-free nur mit speziellen pipe Operatoren
// - effect - zyklische Abhängigkeiten mit untracked, allowSignalWrites

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent implements OnInit {
  from = signal('London');
  to = signal('Paris');
  message = signal('');
  destroyRef = inject(DestroyRef);

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  private flightService = inject(FlightService);
  private date$ = interval(1000).pipe(map(() => new Date()));
  protected date = toSignal(this.date$, { initialValue: new Date() });
  protected prettyDate = computed(() => toPrettyDate(this.date()));
  protected prettySearch = computed(() => `${this.from()} - ${this.to()}`);
  protected prettySearch$ = toObservable(this.prettySearch);

  from$ = toObservable(this.from);
  to$ = toObservable(this.to);

  flightsData$ = combineLatest([this.from$, this.to$]).pipe(
    filter(([from, to]) => from.length > 3 && to.length > 3),
    debounceTime(500),
    switchMap(([from, to]) =>
      this.flightService.find(from, to).pipe(
        map((flights) => ({ flights, hasError: false })),
        catchError(() => of({ flights: [] as Flight[], hasError: true }))
      )
    )
  );

  flightsData = toSignal(this.flightsData$, {
    initialValue: { flights: [], hasError: false },
  });

  async search() {
    const flights = await this.flightService.findPromise(
      this.from(),
      this.to()
    );
  }

  ngOnInit(): void {
    // interval(1000)
    //   .pipe(startWith(0), takeUntilDestroyed(this.destroyRef))
    //   .subscribe(console.log);
  }

  delay(): void {
    this.flightService.delay();
  }
}
