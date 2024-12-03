import {
  afterNextRender,
  Component,
  computed,
  effect,
  input,
  output,
  OnInit,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { Flight } from '../model/flight';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-flight-card',
  template: `
    <div [class]="selectedCss()">
      <h2>{{ flight().from }} - {{ flight().to }}</h2>
      <p>Flugnr. #{{ flight().id }}</p>
      <p>Datum: {{ flight().date | date: 'dd.MM.yyyy' }}</p>
      <p>
        <button (click)="selectedChange.emit(true)">Select</button>
        <button (click)="selectedChange.emit(false)">Deselect</button>
        <a class="btn" [routerLink]="['/flights/edit', flight().id]">Edit</a>
      </p>
    </div>
  `,
  standalone: true,
  styles: `
    div.selected {
      padding: 20px;
      background-color: orange;
    }

    div.not-selected {
      padding: 20px;
      background-color: lightsteelblue;
    }

    div.box {
      border-color: red;
      border-width: 4px;
    }
  `,
  imports: [DatePipe, RouterLink],
})
export class FlightCardComponent {
  flight = input.required<Flight>();
  selected = input.required<boolean>();

  blinker = computed(() => {
    const value = this.selected();
    setTimeout(() => this.selectedChange.emit(!value), 1000);
  });

  number1 = signal(1);
  number2 = signal(2);
  // sum = computed(() => this.number1() + this.number2());

  sum = signal(this.number1() + this.number2());

  sumEffect = effect(() => {
    this.sum.set(this.number1() + this.number2());
  });

  injector = inject(Injector);
  blinkEffect = effect(() => this.blinker());

  selectedChange = output<boolean>();
  edit = output<void>();

  selectedCss = computed(() => ({
    selected: this.selected(),
    'not-selected': !this.selected(),
    box: true,
  }));
}
