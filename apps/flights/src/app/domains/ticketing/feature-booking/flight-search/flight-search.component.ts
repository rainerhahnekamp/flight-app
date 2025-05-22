import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Flight } from '@demo/ticketing/data';
import { FlightCardComponent } from '@demo/ticketing/ui/flight-card/flight-card.component';
import { signalMethod } from '@ngrx/signals';
import { ReduxFlightStore } from '@demo/ticketing/data/redux-flight-store';
import { Dispatcher, injectDispatch } from '@ngrx/signals/events';
import { flightEvents } from '@demo/ticketing/data/flight-events';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent],
})
export class FlightSearchComponent {
  readonly #flightStore = inject(ReduxFlightStore);

  readonly from = linkedSignal(this.#flightStore.searchParams.from);
  readonly to = linkedSignal(this.#flightStore.searchParams.to);

  readonly searchParams = computed(() => ({
    from: this.from(),
    to: this.to(),
  }));

  flights = this.#flightStore.flights;

  events = injectDispatch(flightEvents);

  constructor() {
    effect(() => {
      this.events.search(this.searchParams());
    });
  }

  search(): void {}

  select(flight: Flight): void {}

  getCurrentTime() {
    // return '';
    // return new Date().toLocaleTimeString();
  }

  updateTime() {}

  resetSearchForm() {}

  syncToLocalStorage() {}
}
