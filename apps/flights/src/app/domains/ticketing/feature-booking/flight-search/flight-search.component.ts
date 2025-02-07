import {
  Component,
  ElementRef,
  NgZone,
  inject,
  signal,
  computed,
  untracked,
  SkipSelf,
  InjectionToken,
  Inject,
  effect,
  OnInit,
  DestroyRef,
  Injector,
  runInInjectionContext,
  resource,
  linkedSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/ticketing/data';
import { addMinutes } from 'date-fns';
import {
  async,
  debounceTime,
  delay,
  finalize,
  from,
  interval,
  lastValueFrom,
  map,
  of,
  pipe,
  startWith,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  rxResource,
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { id } from 'date-fns/locale';
import { FlightsStore } from './flight-store';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent],
  providers: [FlightsStore],
})
export class FlightSearchComponent {
  protected readonly flightsStore = inject(FlightsStore);

  from = linkedSignal(() => this.flightsStore.searchParams().from);
  to = linkedSignal(() => this.flightsStore.searchParams().to);
  searchParams = computed(() => ({ from: this.from(), to: this.to() }));

  constructor() {
    this.flightsStore.syncSearchParams(this.searchParams);
  }

  flights = this.flightsStore.flights;
  basket = this.flightsStore.basket;
  basketCount = this.flightsStore.basketCount;
  status = this.flightsStore.status;
  prettySearch = this.flightsStore.prettySearch;

  search() {
    // void this.flightsStore.search();
  }

  updateBasket(flightId: number) {
    this.flightsStore.addToBasket(flightId, true);
  }
}
