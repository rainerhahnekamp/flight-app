import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightCard } from './flight-card';
import { FlightClient } from './flight-client';
import { FlightSearchForm } from './flight-search-form';
import { Flight } from './model/flight';
import { FlightSearchParams } from './model/flight-search-params';

@Component({
  selector: 'app-flight-search',
  template: `<div class="header">
      <h2 class="title">Flight Search</h2>
    </div>

    <div class="row">
      <flight-search-form
        [searchParams]="searchParams"
        (searched)="search($event)"
      />
    </div>

    <div class="row">
      @for (flight of flights; track $index) {
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <app-flight-card [flight]="flight"></app-flight-card>
        </div>
      }
    </div> `,
  imports: [FormsModule, FlightCard, FlightSearchForm],
})
export default class FlightSearchPage {
  searchParams = { from: 'København', to: 'Wien' };
  protected flights: Flight[] = [];

  readonly #flightClient = inject(FlightClient);

  search(searchParams: FlightSearchParams): void {
    const { from, to } = searchParams;

    this.#flightClient.search(from, to).subscribe({
      next: (flights) => {
        this.flights = flights;
      },
      error: (errResp) => {
        console.error('Error loading flights', errResp);
      },
    });
  }
}
