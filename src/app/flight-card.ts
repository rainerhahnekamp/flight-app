import {
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  Input, model,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange, ViewChild, viewChild
} from "@angular/core";
import {Flight} from "./entities/flight";
import {DatePipe} from "@angular/common";
import {TimeComponent} from "./dummy";

const initFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
  airline: {name: '', code: ''}
}

@Component({
  selector: 'flight-card',
  imports: [
    DatePipe,
    TimeComponent
  ],
  template: `
    @let item = this.item();
    <div style="padding:20px;" [style]="bgColor()">
      <h2>{{ item.from }} - {{ item.to }}</h2>

      <app-time #time />
      <p>Double ID: {{ doubleId() }}</p>

      <div class="promotion">
        <ng-content select="[data-form]"/>
      </div>

      <p>Flugnr. #{{ item.id }}</p>
      <p>
        Datum: {{ item.date | date:'dd.MM.yyyy' }}</p>
      <p>

      <div class="promotion">
        <ng-content select="[data-promition]"/>
      </div>

      @if (selected()) {
        <button (click)="deselect()">Deselect</button>

      } @else {
        <button (click)="select()">Select</button>
      }
    </div>
  `
})
export class FlightCard {
  item = input.required<Flight>()
  selected = model(false);

  timeComponent = viewChild(TimeComponent)

  bgColor = computed(() => ({
    'background-color': this.selected() ? 'orange' : 'lightsteelblue'
  }))

  doubleId = computed(() => this.item().id * 2)


  _ = effect(() => this.timeComponent()?.sub)

  constructor() {
  }

  ngOnDestroy() {
    console.log('destroying...')
  }


  protected select() {
    this.selected.set(true);
  }

  protected deselect() {
    this.selected.set(false);

  }
}
