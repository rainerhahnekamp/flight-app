import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../model/flight';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../model/booking';
import { map, pipe } from 'rxjs';
import { Passenger } from '../model/passenger';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent {
  from = 'Paris';
  to = 'London';
  flights: Array<Flight> = [];
  selectedFlight: Flight | undefined;
  message = '';

  private http = inject(HttpClient);

  search(): void {
    this.message = '';
    this.selectedFlight = undefined;

    const url = 'https://demo.angulararchitects.io/api/flight';

    const headers = {
      Accept: 'application/json',
    };

    const params = {
      from: this.from,
      to: this.to,
    };

    this.http.get<Flight[]>(url, { params, headers }).subscribe({
      next: (flights) => {
        this.flights = flights;
      },
      error: (errResp) => {
        console.error('Error loading flights', errResp);
      },
    });
  }

  save(): void {
    if (!this.selectedFlight) return;

    const url = 'https://demo.angulararchitects.io/api/flight';

    const headers = {
      Accept: 'application/json',
    };

    this.http.post<Flight>(url, this.selectedFlight, { headers }).subscribe({
      next: (flight) => {
        this.selectedFlight = flight;
        this.message = 'Update successful!';
        this.from = flight.from;
        this.to = flight.to;
        this.search();
      },
      error: (errResponse) => {
        this.message = 'Error on updating the Flight';
        console.error(this.message, errResponse);
      },
    });
  }

  select(f: Flight): void {
    const flight = { ...f };
    this.selectedFlight = flight;

    const headers = {
      Accept: 'application/json',
    };

    this.http
      .get<Booking[]>('https://demo.angulararchitects.io/api/booking', {
        params: { flightId: this.selectedFlight?.id },
        headers,
      })
      .pipe(map((bookings) => bookings.map((booking) => booking.passengerId)))
      .subscribe({
        next: (passengerIds) => {
          this.http
            .get<Passenger[]>(
              'https://demo.angulararchitects.io/api/passenger',
              { params: {}, headers }
            )
            .subscribe({
              next: (passenger) => {
                flight.passengers = passenger.filter(
                  (p) => p.id in passengerIds
                );
              },
              error: (errResp) => {
                console.error('Error loading passengers', errResp);
              },
            });
        },
        error: (errResp) => {
          console.error('Error loading bookings', errResp);
        },
      });
  }
}
