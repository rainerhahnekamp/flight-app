import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightStore } from '../flight-store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, of, pipe, tap } from 'rxjs';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent],
})
export class FlightSearchComponent {
  protected flightStore = inject(FlightStore);

  from = linkedSignal(this.flightStore.searchParams.from);
  to = linkedSignal(this.flightStore.searchParams.to);

  flights = this.flightStore.flights;
  searchActive = false;
  searchParams = computed(() => ({ from: this.from(), to: this.to() }));

  // flights = resource({
  //   request: this.searchParams,
  //   loader: async (param) => {
  //     const { from, to } = param.request;
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     return this.flightService.findPromise(from, to, param.abortSignal);
  //   },
  // });

  // flights = resource({
  //   request: () => (this.searchEnabled() ? true : undefined),
  //   loader: ({ abortSignal }) =>
  //     this.flightService.findPromise(this.from(), this.to(), abortSignal),
  // });

  constructor() {
    this.flightStore.oldSearch(this.searchParams);
  }

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  reset() {
    this.flightStore.reset();
  }

  search() {
    // void this.flightStore.search(this.from(), this.to());
  }
}
