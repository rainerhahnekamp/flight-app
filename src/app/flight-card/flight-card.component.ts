import {
  Component, computed,
  EventEmitter,
  input,
  Input, model,
  OnChanges,
  OnDestroy,
  OnInit,
  Output, signal,
  SimpleChanges
} from '@angular/core';
import {Flight} from "../entities/flight";
import {DatePipe} from "@angular/common";
import {MyDatePipe} from "../city-pipe";

const nullFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false
}

@Component({
  selector: 'app-flight-card',
  template: `
    @if (flight()) {
      <div style="padding:20px;"
           [style]="bgColor()">
        <h2>{{title()}}</h2>

        <p>FlightNr. #{{ flight().id }}</p>
        <p>Date: {{ flight().date | myDate }}</p>
        <p>
          <button (click)="select()">Select</button>
          <button (click)="deselect()">Deselect</button>
        </p>
      </div>
    }
  `,
  imports: [
    MyDatePipe
  ],
  styleUrl: './flight-card.component.css'
})
export class FlightCardComponent  {
  flight = input.required<Flight>()
  selected = model.required<boolean>();
  title = computed(() =>`${this.flight().from} to ${this.flight().to}`)
  bgColor = computed(() =>
    ({'background-color': (this.selected()) ? 'orange' : 'lightsteelblue'}))

  protected select() {
    this.selected.set(true);
  }

  protected deselect() {
    this.selected.set(false);
  }
}
