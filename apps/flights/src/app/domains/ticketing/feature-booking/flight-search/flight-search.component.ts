import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import {
  CityPipe,
  DateCvaDirective,
  DateStepperComponent,
} from '@demo/shared/ui-common';
import { Flight, FlightService } from '@demo/ticketing/data';
import { FlightStore } from '@demo/ticketing/feature-booking/flight-search/flight-store';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  TicketsAppState,
  ticketsFeature,
} from '@demo/ticketing/data/+state/tickets.reducers';
import { fromTickets } from '@demo/ticketing/data/+state/tickets.selectors';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, map, of, pipe, tap } from 'rxjs';
import { debug } from '../../../../shell/home/home.component';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CityPipe,
    FlightCardComponent,
    DateCvaDirective,
    DateStepperComponent,
  ],
})
export class FlightSearchComponent {
  from = signal('London');
  to = signal('Paris');
  flightStore = inject(FlightStore);
  flights = this.flightStore.flights;
  isLoading = this.flightStore.loading;

  prettySearch = this.flightStore.prettySearch;
  searchParams = computed(() => ({ from: this.from(), to: this.to() }));

  constructor() {
    this.flightStore.connectParams(this.searchParams);
  }

  // eher RxJs Fall
  // #searchEffect = effect(async () =>
  //   this.flights.set(
  //     await this.flightService.findPromise(this.from(), this.to())
  //   )
  // );

  #logEffect = effect(() => console.log(this.prettySearch()));
  // #searchEffect = effect(() => {
  //   // 1. Tracking
  //   const from = this.from();
  //
  //   // 2. Ausführung
  //   untracked(() => {
  //     if (from === 'Wien') {
  //       this.search();
  //     }
  //   });
  // });

  selectedFlight: Flight | undefined;

  message = '';
  date = new Date();

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  private store: Store<TicketsAppState> = inject(Store);

  // flights$ = this.store.selectSignal(fromTickets.selectFlights);
  // flightsCount$ = this.store.selectSignal((state) => state.tickets.flights.length);
  // loaded$ = this.store.selectSignal(ticketsFeature.selectIsLoaded);

  select(f: Flight): void {
    this.selectedFlight = { ...f };
  }

  toggleLoaded() {
    // this.store.dispatch(ticketsActions.toggleLoaded());
  }
}
