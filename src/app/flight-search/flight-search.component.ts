import { Component, inject } from '@angular/core';
import { CommonModule, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { createFlight, Flight } from '../models/flight';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, JsonPipe],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent {
  httpClient = inject(HttpClient);
  from = 'Wien';
  to = 'Berlin';

  flights: Flight[] = [];

  selectedFlight: Flight | undefined;

  search() {
    this.httpClient
      .get<Flight[]>('https://demo.angulararchitects.io/api/flight', {
        params: { from: this.from, to: this.to },
      })
      .subscribe((flights) => (this.flights = flights));
  }

  select(flight: Flight) {
    this.selectedFlight = flight;
  }
}
