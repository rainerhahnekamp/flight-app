import {
  Component,
  computed,
  EventEmitter,
  input,
  Input,
  model,
  output,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Flight } from './model/flight';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'flight-card',
  imports: [DatePipe, RouterLink],
  template: `
    @let item = this.item();
    <div style="padding:20px;" [style]="style()">
      <h2>{{ title() }}</h2>

      <p>Flugnr. #{{ item.id }}</p>

      <p>Datum: {{ item.date | date : 'dd.MM.yyyy' }}</p>

      <p>
        <button (click)="select()">Select</button>
        <button (click)="deselect()">Deselect</button>
        <a [routerLink]="['/flight-edit', item.id]">Edit</a>
      </p>
    </div>
  `,
})
export class FlightCard {
  public readonly selected = model(false);
  public readonly item = input.required<Flight>();

  protected readonly title = computed(
    () => `${this.item().from} - ${this.item().to}`
  );

  protected readonly style = computed(() => ({
    'background-color': this.selected() ? 'orange' : 'lightsteelblue',
  }));

  select() {
    this.selected.set(true);
  }

  deselect() {
    this.selected.set(false);
  }
}
