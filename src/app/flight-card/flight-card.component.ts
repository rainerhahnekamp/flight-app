import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Flight } from '../models/flight';
import { DatePipe, NgStyle } from '@angular/common';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [NgStyle, DatePipe],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.css',
})
export class FlightCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() header = '';
  @Input() item: Flight | undefined;
  @Input() selected = true;
  @Output() selectedChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<Flight>();

  deselect() {
    this.selectedChange.emit(false);
  }

  select() {
    this.selectedChange.emit(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
  }

  ngOnDestroy(): void {}

  constructor() {}

  ngOnInit(): void {
    this.selectedChange.emit(!this.selected);
  }
}
