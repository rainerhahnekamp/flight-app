import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component.ng';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  concatMap,
  debounceTime,
  map,
  of,
  pipe,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { FlightStore } from '@demo/ticketing/feature-booking/flight-search/flight-store.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { FlightService } from '@demo/ticketing/data';

/**
 * effect()
 * rxResource with just loader
 * rxResource with default value
 * rxResource with request
 * isLoading/hasValue/error in template
 * pre-fetching
 * conditional requests
 * requests with Observable
 * requests on click (button)
 * fallback to resource
 * resource with streaming and HttpClient
 * httpResource
 */

// import { CheckinService } from '@demo/checkin/data/checkin.service';
/**
 * Agenda
 * - linkedSignal, resource
 * - NgRx
 * - Nx / Architektur
 * - zoneless
 */

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent],
})
export class FlightSearchComponent {
  private readonly flightStore = inject(FlightStore);

  protected readonly from = linkedSignal(this.flightStore.searchParams.from);
  protected readonly to = linkedSignal(this.flightStore.searchParams.to);

  protected readonly flights = this.flightStore.flights;
  protected readonly prettySearch = this.flightStore.prettySearch;
  searchParams = computed(() => ({ from: this.from(), to: this.to() }));

  constructor() {
    this.flightStore.setSearchParams(this.searchParams);
  }

  // searchParams = signal({ from: '', to: '' });

  debounce<T>(value: Signal<T>, time = 500) {
    return toSignal(toObservable(value).pipe(debounceTime(time)), {
      initialValue: value(),
    });
  }

  params = this.debounce(this.searchParams, 500);

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  search(): void {
    this.flightStore.setSearchParams({ from: this.from(), to: this.to() });
  }

  delay() {
    this.flightStore.delay();
  }

  setToWien() {
    this.flightStore.setToWien();
  }
}
