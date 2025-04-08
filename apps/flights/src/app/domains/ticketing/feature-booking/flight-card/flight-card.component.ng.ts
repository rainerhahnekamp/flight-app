import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  NgZone,
  signal,
  untracked,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FlightEditReactiveComponent } from '../flight-edit-reactive/flight-edit-reactive.component';
import { RouterLink } from '@angular/router';
import { CityPipe, StatusToggleComponent } from '@demo/shared/ui-common';
import { Flight } from '@demo/ticketing/data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [
    CommonModule,
    CityPipe,
    StatusToggleComponent,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './flight-card.component.ng.html',
  styleUrls: ['./flight-card.component.ng.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightCardComponent {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  private dialog = inject(MatDialog);

  item = input.required<Flight>();
  from = linkedSignal(() => this.item().from);
  to = linkedSignal(() => this.item().to);

  selected = model.required<boolean>();

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
}
