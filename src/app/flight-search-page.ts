import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightCard } from './flight-card';
import { FlightSearchForm } from './flight-search-form';
import { Flight } from './model/flight';
import { FlightSearchParams } from './model/flight-search-params';

@Component({
  template: `<div class="header">
      <h2 class="title">Flight Search</h2>
    </div>

    @defer (on interaction(button)) {
      <div class="row">
        <flight-search-form
          [searchParams]="searchParams()"
          (searched)="search($event)"
        />
      </div>
    } @placeholder {
      <button #button>Activate Search Form</button>
    }

    @if (flights.hasValue()) {
      <div class="row">
        @for (flight of flights.value(); track $index) {
          @defer (on viewport) {
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <app-flight-card [flight]="flight"></app-flight-card>
            </div>
          } @placeholder {
            <span>&nbsp;</span>
          }
        }
      </div>
    } @else if (flights.isLoading()) {
      <p>Loading...</p>
    } @else if (flights.error()) {
      <p>Error: {{ flights.error() }}</p>
    }`,
  selector: 'app-flight-search',
  imports: [FormsModule, FlightCard, FlightSearchForm],
})
export default class FlightSearchPage {
  searchParams = signal({ from: 'Kobenhavn', to: 'Wien' });

  protected flights = httpResource<Flight[]>(() => ({
    url: 'https://demo.angulararchitects.io/api/flight/',
    params: this.searchParams(),
  }));

  search(searchParams: FlightSearchParams): void {
    this.searchParams.set(searchParams);
  }
}
