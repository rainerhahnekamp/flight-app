import { Component, input, model } from '@angular/core';
import { Flight } from './model/flight';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-flight-card',
  template: `@let flight = this.flight();

    <div [class]="{ selected: selected }" class="card">
      <div class="card-header">
        <h2 class="title">{{ flight.from }} - {{ flight.to }}</h2>
      </div>

      <div class="card-body">
        <p>Flight-No.: #{{ flight.id }}</p>
        <p>Date: {{ flight.date | date: 'dd.MM.yyyy HH:mm' }}</p>
        <p [style]="{ color: flight.delayed ? 'red' : null }">
          Delayed: {{ flight.delayed }}
        </p>
        <p>
          <a [routerLink]="['/flights/edit', flight.id]" class="btn btn-default"
            >Edit</a
          >
        </p>
      </div>
    </div>`,
  imports: [DatePipe, RouterLink],
})
export class FlightCard {
  readonly flight = input.required<Flight>();
  readonly selected = model(false);
}
