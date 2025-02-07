import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  NgZone,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FlightEditReactiveComponent } from '../flight-edit-reactive/flight-edit-reactive.component';
import { RouterLink } from '@angular/router';
import { StatusToggleComponent } from '@demo/shared/ui-common';
import { Flight } from '@demo/ticketing/data';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { from } from 'rxjs';

type Booking = {
  id: number;
  seat: string;
};

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [
    CommonModule,
    StatusToggleComponent,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css'],
})
export class FlightCardComponent {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  private dialog = inject(MatDialog);

  item = input.required<Flight>();
  formFlight = linkedSignal(this.item);

  selected = model(false);
  title = computed(() => {
    const flight = this.item();
    return `${flight.from} - ${flight.to}`;
  });
  formGroup = inject(NonNullableFormBuilder).group({ from: [''], to: [''] });
  formSyncer = effect(() => {
    this.formGroup.setValue(this.item());
  });

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

  blink() {
    // Dirty Hack used to visualize the change detector
    this.element.nativeElement.firstChild.style.backgroundColor = 'crimson';

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.element.nativeElement.firstChild.style.backgroundColor = 'white';
      }, 1000);
    });

    return null;
  }

  protected readonly from = from;
}
