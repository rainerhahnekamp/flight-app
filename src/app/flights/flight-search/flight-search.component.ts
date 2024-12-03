import {
  Component,
  inject,
  signal,
  OnDestroy,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { Flight } from '../model/flight';
import { FormsModule, NgForm } from '@angular/forms';
import { async, Observable, Subscription } from 'rxjs';
import { CityPipe } from '../ui/city.pipe';
import { CachedFlightSearchService } from '../data/cached-flight-search.service';
import { FlightCardComponent } from '../ui/flight-card.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CityValidator } from '../ui/city.directive';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    FormsModule,
    FlightCardComponent,
    JsonPipe,
    AsyncPipe,
    CityValidator,
  ],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent {
  from = signal('London');
  to = 'Paris';
  flights = signal<Array<Flight>>([]);
  selectedFlight: Flight | undefined;

  ngForm = viewChild.required<NgForm>('ngForm');

  constructor() {
    afterNextRender(() => {
      console.log('Formular: %o', this.ngForm());
    });
  }

  // basket: Array<number> = [];
  basket: Record<number, boolean> = { 1268: true };

  readonly #flightSearch = inject(CachedFlightSearchService);

  async search() {
    if (this.ngForm().form.valid) {
      this.flights.set(await this.#flightSearch.search(this.from(), this.to));
    }
  }

  select(flight: Flight): void {
    this.selectedFlight = { ...flight };
  }

  message$: Observable<string> | undefined;
  subs: Array<Subscription> = [];
  message = signal('');

  async saveFlight() {
    const selectedFlight = this.selectedFlight;
    if (!selectedFlight) {
      return;
    }
    await this.#flightSearch.save(selectedFlight);
    this.to = selectedFlight.to;
    this.from.set(selectedFlight.from);
    this.selectedFlight = undefined;
    await this.search();
    this.message.set('Speicherung war erfolgreich');
  }

  protected readonly async = async;
}
