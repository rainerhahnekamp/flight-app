import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  model,
  Output,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FlightEditReactiveComponent } from '../../feature-booking/flight-edit-reactive/flight-edit-reactive.component';
import { RouterLink } from '@angular/router';
import { CityPipe, StatusToggleComponent } from '@demo/shared/ui-common';
import { initFlight } from '@demo/ticketing/data';
import { interval, map, startWith } from 'rxjs';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule, CityPipe, StatusToggleComponent, RouterLink],
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css'],
})
export class FlightCardComponent {
  private dialog = inject(MatDialog);

  item = input(initFlight);
  selected = model<boolean>();
  time = signal(new Date().toLocaleTimeString());

  time$ = interval(1000).pipe(
    startWith(0),
    map(() => new Date().toLocaleTimeString())
  );

  constructor() {
    this.time$.subscribe((value) => this.time.set(value));
  }

  select() {
    this.selected.set(true);
  }

  deselect() {
    this.selected.set(false);
  }

  edit() {
    this.dialog.open(FlightEditReactiveComponent, {
      data: { flight: this.item },
    });
  }
}
