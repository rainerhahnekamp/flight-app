import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../model/flight';
import { FormsModule } from '@angular/forms';
import { FlightService } from './flight.service';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent implements OnInit {
  from: string = '';
  to: string = '';
  flights: Array<Flight> = [];
  selectedFlight: Flight | undefined;
  message = '';

  private service = inject(FlightService);

  ngOnInit() {
    this.service.refresh().subscribe({
      next: (result) => {
        this.from = result.from;
        this.to = result.to;
        this.flights = result.flights;
      },
    });
  }

  search(): void {
    this.message = '';
    this.selectedFlight = undefined;

    this.service.find(this.from, this.to).subscribe({
      next: (flights) => {
        this.flights = flights;
      },
    });
  }

  save(): void {
    if (!this.selectedFlight) return;

    this.service.save(this.selectedFlight).subscribe({
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

    this.service.findPassengersByFlight(f).subscribe({
      next: (passengers) => {
        this.selectedFlight = { ...flight, passengers };
      },
      error: (errResp) => {
        console.error('Error loading bookings', errResp);
      },
    });
  }
}
