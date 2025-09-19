import {
  Component,
  ElementRef,
  inject,
  Input,
  input,
  model,
  NgZone,
  signal,
  Signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FlightEditReactiveComponent } from '../flight-edit-reactive/flight-edit-reactive.component';
import { RouterLink } from '@angular/router';
import { CityPipe, StatusToggleComponent } from '@demo/shared/ui-common';
import { Flight } from '@demo/ticketing/data';
import { interval, map, Observable, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule, CityPipe, StatusToggleComponent, RouterLink],
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css'],
})
export class FlightCard {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  private dialog = inject(MatDialog);

  readonly item = input.required<Flight>();
  readonly selected = model(false);

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
