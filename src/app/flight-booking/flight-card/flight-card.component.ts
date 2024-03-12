import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  Output,
} from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { initFlight } from '../../model/flight';
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

  @Input() item = initFlight;
  @Input() selected: boolean = false;
  @Output() selectedChange = new EventEmitter<boolean>();

  ngOnInit() {
    // setInterval(() => {
    //   this.lastUpdated = (new Date().getTime() - this.date.getTime()) / 1_000;
    //   // this.cdr.markForCheck();
    // }, 1000);
  }

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

  handleClick() {}
}
