import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Flight } from './model/flight';
import { DatePipe } from '@angular/common';
import { FlightClient } from './flight-client';
import { RouterLink } from '@angular/router';
import { DatumShower } from './flight-search/datum-shower';

@Component({
  selector: 'app-flight-card',
  template: `
    @let flight = this.flight();
    <div style="padding: 20px" [style]="bgColor()">
      <ng-content select="section"></ng-content>
      <p>
        <button class="btn" (click)="selected.set(true)">Select</button>
        <button class="btn" (click)="selected.set(false)">Deselect</button>
        <a class="btn" [routerLink]="['../edit', flight.id]">Bearbeiten</a>
      </p>
      <section>
        <h2>{{ flight.from }} - {{ flight.to }}</h2>

        <p>Flugnr. #{{ flight.id }}</p>
      </section>

      <footer>
        <datum-shower [date]="flight.date" />
      </footer>
    </div>
  `,
  imports: [RouterLink, DatumShower],
})
export class Card {
  readonly flight = input.required<Flight>();
  selected = model.required<boolean>();

  constructor() {}

  bgColor = computed(() => ({
    'background-color': this.selected() ? 'orange' : 'lightsteelblue',
  }));
}
