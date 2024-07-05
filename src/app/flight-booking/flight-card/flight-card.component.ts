import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { initFlight } from '../../model/flight';
import { CityPipe } from '../../shared/city.pipe';
import { StatusToggleComponent } from '../../shared/status-toggle/status-toggle.component';
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

  @Input() item = initFlight;
  @Input() selected = false;
  @Output() selectedChange = new EventEmitter<boolean>();

  element = inject(ElementRef);
  zone = inject(NgZone);

  ngOnInit() {}

  select() {
    this.selected = true;
    this.selectedChange.emit(this.selected);
  }

  deselect() {
    this.selected = false;
    this.selectedChange.emit(this.selected);
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
