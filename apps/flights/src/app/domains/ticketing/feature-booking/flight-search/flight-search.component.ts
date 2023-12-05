import {
  Component,
  ElementRef,
  NgZone,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { CityPipe } from '@demo/shared/ui-common';
import { Flight, FlightService, FlightsStore } from '@demo/ticketing/data';
import { FlightSearchFormComponent } from '@demo/ticketing/feature-booking/flight-search-form.component';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  providers: [FlightsStore],
  imports: [
    CommonModule,
    FormsModule,
    CityPipe,
    FlightCardComponent,
    FlightSearchFormComponent,
  ],
})
export class FlightSearchComponent {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  protected flightsStore = inject(FlightsStore);

  basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });

  counter = signal(0);

  constructor() {
    effect(() => console.log(this.counter()));
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.basket.update((basket) => ({
      ...basket,
      [flightId]: selected,
    }));
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
}
