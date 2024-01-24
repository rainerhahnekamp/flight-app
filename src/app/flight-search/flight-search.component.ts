import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../models/flight';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../flight.service';
import { Observable, of, Subscription } from 'rxjs';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import {
  FlightSearchFormComponent,
  SearchParams,
} from '../flight-search-form/flight-search-form.component';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FlightCardComponent,
    FlightSearchFormComponent,
  ],
})
export class FlightSearchComponent implements OnDestroy {
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  searchParams: SearchParams = { from: 'Wien', to: 'Berlin' };
  flights: Flight[] = [];
  selectedFlight: Flight | undefined;
  message = '';
  basket = new Map<number, boolean>();
  private flightSearch = inject(FlightService);
  counter = 1;
  subscription: Subscription | undefined;

  search() {
    // Reset properties
    this.message = '';
    this.selectedFlight = undefined;

    this.subscription = this.flightSearch
      .search(this.searchParams.from, this.searchParams.to)
      .subscribe((flights) => (this.flights = flights));
  }

  save() {
    if (!this.selectedFlight) return;

    // await this.flightSearch.save(this.selectedFlight);
    this.flightSearch
      .save(this.selectedFlight)
      .catch(() => (this.message = 'Flug wurde nicht gespeichert'));
    this.message = 'Flug wurde gespeichert';
  }

  select(f: Flight): void {
    this.selectedFlight = structuredClone(f);
  }
}
