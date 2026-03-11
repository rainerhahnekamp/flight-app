/* eslint-disable @angular-eslint/prefer-standalone */

import { Component, inject } from '@angular/core';
import { NextFlightStore } from './next-flight-store';

@Component({
  selector: 'app-next-flights',
  standalone: false,
  templateUrl: './next-flights.component.html',
  styleUrls: ['./next-flights.component.css'],
})
export class NextFlightsComponent {
  nextFlightStore = inject(NextFlightStore);

  flights = this.nextFlightStore.flights;
}
