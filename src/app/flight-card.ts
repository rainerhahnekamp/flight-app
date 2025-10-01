import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  signal,
} from '@angular/core';
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

      <p>{{ time() }}</p>

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightCard {
  readonly flight = input.required<Flight>();
  readonly selected = model(false);
  readonly time = signal(new Date().toLocaleTimeString());

  constructor() {
    setInterval(() => this.time.set(new Date().toLocaleTimeString()), 1000);
  }
}
