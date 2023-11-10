import {Component, computed, effect, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlightCardComponent} from '../flight-card/flight-card.component';
import {CityPipe} from '@demo/shared/ui-common';
import {Flight, FlightService} from '@demo/ticketing/data';
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {debounceTime} from "rxjs";
import {FlightStore} from "@demo/ticketing/data";

// import { CheckinService } from '@demo/checkin/data';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
})
export class FlightSearchComponent {
  selectedFlight: Flight | undefined;
  message = '';
  date = new Date();
  flightStore = inject(FlightStore)

  basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  })

  constructor() {
    effect(
      () => console.log(this.flightRoute())
    );
  }

  lazyFrom$ = toObservable(this.flightStore.from).pipe(
    debounceTime(300)
  );

  lazyFrom = toSignal(this.lazyFrom$, {
    initialValue: this.flightStore.from()
  });

  flightRoute = computed(() => 'From ' + this.lazyFrom() + ' to ' + this.flightStore.to() + '.');

  private flightService = inject(FlightService);

  search(): void {
    // Reset properties
    this.message = '';
    this.selectedFlight = undefined;
    this.flightStore.search()
  }

  select(f: Flight): void {
    this.selectedFlight = {...f};
  }

  updateBasket(id: number, selected: boolean): void {
    this.basket.update(basket => ({...basket, [id]: selected}));
  }
}
