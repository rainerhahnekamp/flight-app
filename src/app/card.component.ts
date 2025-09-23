import {
  Component,
  computed,
  EventEmitter,
  Input,
  input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Flight } from './model/flight';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-flight-card',
  template: `
    <div style="padding: 20px" [style]="bgColor()">
      <ng-content select="section"></ng-content>
      <p>
        <button (click)="selected.set(true)">Select</button>
        <button (click)="selected.set(false)">Deselect</button>
      </p>
      <ng-content select="footer"></ng-content>
    </div>
  `,
})
export class Card {
  selected = model.required<boolean>();

  bgColor = computed(() => ({
    'background-color': this.selected() ? 'orange' : 'lightsteelblue',
  }));
}
