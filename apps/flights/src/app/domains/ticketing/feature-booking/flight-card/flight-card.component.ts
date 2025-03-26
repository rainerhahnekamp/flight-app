import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  NgZone,
  output,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FlightEditReactiveComponent } from '../flight-edit-reactive/flight-edit-reactive.component';
import { RouterLink } from '@angular/router';
import { CityPipe, StatusToggleComponent } from '@demo/shared/ui-common';
import { Flight, initFlight } from '@demo/ticketing/data';
import { FormsModule } from '@angular/forms';
import { FlightWithFavourite } from '../../data/flight-store';
import { interval, map } from 'rxjs';

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
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightCardComponent {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  private dialog = inject(MatDialog);

  now = signal(new Date().toLocaleTimeString());
  counter = 0;

  // now$ = interval(1000).pipe(map(() => new Date().toLocaleTimeString()));
  constructor(cdr: ChangeDetectorRef) {
    // this.now$.subscribe((value) => {
    //   this.now = value;
    // });
    setInterval(() => {
      this.counter++;
      if (this.counter % 4 === 0) {
        this.now.set(new Date().toLocaleTimeString());
      }
    }, 1000);
  }

  item = input.required<FlightWithFavourite>();
  // from = computed(() => this.item().from);

  from = linkedSignal(() => this.item().from);
  addFavourite = output<number>();
  removeFavourite = output<number>();

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

  handleRemoveFavourite(id: number) {
    this.removeFavourite.emit(id);
  }

  handleAddFavourite(id: number) {
    this.addFavourite.emit(id);
  }
}
