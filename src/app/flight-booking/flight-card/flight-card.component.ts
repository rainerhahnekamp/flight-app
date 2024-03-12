import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Input,
  model,
  NgZone,
  Output,
} from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Flight, initFlight } from '../../model/flight';
import { CityPipe } from '../../shared/city.pipe';
import { StatusToggleComponent } from '../../shared/status-toggle/status-toggle.component';
import { FlightEditComponent } from '../flight-edit/flight-edit.component';
import { FlightEditReactiveComponent } from '../flight-edit-reactive/flight-edit-reactive.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule, CityPipe, StatusToggleComponent, RouterLink],
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightCardComponent {
  private dialog = inject(MatDialog);
  private element = inject(ElementRef);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  private date = new Date();
  protected lastUpdated = 0;

  item = input.required<Flight>();
  selected = model.required<boolean>();

  constructor() {}

  ngOnInit() {
    console.log(this.item());
    // setInterval(() => {
    //   this.lastUpdated = (new Date().getTime() - this.date.getTime()) / 1_000;
    //   // this.cdr.markForCheck();
    // }, 1000);
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

  blink() {}

  handleClick() {}
}
