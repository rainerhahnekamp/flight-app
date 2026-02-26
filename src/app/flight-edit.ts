import { Component, inject, input, numberAttribute } from '@angular/core';
import { Flight } from './model/flight';
import { FlightClient } from './flight-client.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-flight-edit',
  template: `
    <h1>Flight Edit</h1>
    <p>Edit Flight with id {{ id() }}</p>

    <p>Details</p>

    @if(flight.hasValue()) {
    <p>Flight: {{ flight.value() | json }}</p>
    }
  `,
  imports: [JsonPipe],
})
export class FlightEdit {
  id = input.required({ transform: numberAttribute });

  flightClient = inject(FlightClient);

  flight = this.flightClient.findById(this.id);
}
