import {
  Component,
  ElementRef,
  NgZone,
  inject,
  signal,
  computed,
  effect,
  OnInit,
  Injector,
  untracked,
  Signal,
  Type,
  linkedSignal,
  ResourceStatus,
  Resource,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/ticketing/data';
import { addMinutes } from 'date-fns';
import { HttpClient, httpResource } from '@angular/common/http';
import {
  debounceTime,
  delay,
  from,
  interval,
  map,
  Observable,
  of,
  pipe,
  Subject,
  tap,
} from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FlightStore } from '../../data/flight-store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { patchState } from '@ngrx/signals';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

/**
 *     - httpResource
 *         - Perfecting
 *         - Streaming
 *         - rxResource
 *         - httpResource (auch auf POST eingehen und dass Mutation nicht erwarten werden.)
 *         - Klassisch zeigen wie man zwei Eingabefelder mit debounceTime usw. über das beherrsch
 *         - Fehlerbehandlung
 */

type Source = {
  values: Flight[];
  status: ResourceStatus;
};

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  protected flightStore = inject(FlightStore);

  from = linkedSignal(this.flightStore.searchParams.from);
  to = linkedSignal(this.flightStore.searchParams.to);

  flights = this.flightStore.flightResource;

  searchParams = computed(() => ({ from: this.from(), to: this.to() }));

  now = new Date().toLocaleTimeString();

  constructor() {
    setInterval(() => (this.now = new Date().toLocaleTimeString()), 1000);

    const syncer$ = toObservable(this.searchParams).pipe(debounceTime(500));

    this.flightStore.setSearchParams(
      toSignal(syncer$, { initialValue: { from: this.from(), to: this.to() } })
    );
  }

  currentFlights = linkedSignal<Source, Flight[]>({
    source: () => ({
      values: this.flights.value(),
      status: this.flights.status(),
    }),
    computation: (source, previous) => {
      if (source.status !== ResourceStatus.Resolved) {
        return previous?.value ?? [];
      }

      return source.values;
    },
  });

  search(): void {}

  delay(): void {
    // this.flights.update((value) => this.toFlightsWithDelays(value, 15));
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

  showPrettySearch = signal(false);

  togglePrettySearch() {
    this.showPrettySearch.update((value) => !value);
  }

  setToKoeln() {
    // this.flights.update((value) =>
    //   value.map((flight) => ({ ...flight, from: 'Köln' }))
    // );
  }

  refresh() {
    this.flights.reload();
  }
}
