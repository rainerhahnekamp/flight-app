import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-flight-search-form',
  imports: [
    FormsModule
  ],
  template: `<form (ngSubmit)="handleSubmit()">
    <input [(ngModel)]="from" name="from">
    <input [(ngModel)]="to" name="to">

    <button [disabled]="!from || !to">Search</button>
  </form>
  `
})
export class FlightSearchFormComponent {
  @Input() from = ''
  @Input() to = ''

  @Output() search = new EventEmitter<{from: string, to: string}>();

  protected handleSubmit() {
    this.search.emit({from: this.from, to: this.to})
  }
}
