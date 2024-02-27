import {
  Component,
  ElementRef,
  NgZone,
  inject,
  signal,
  computed,
  effect,
  untracked,
  WritableSignal,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { CityPipe } from '@demo/shared/ui-common';
import { Flight, FlightService } from '@demo/ticketing/data';
import { addMinutes } from 'date-fns';
import { debounceTime, interval, of, pipe, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { FlightStore } from '@demo/ticketing/feature-booking/flight-search/flight-store';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
  providers: [FlightStore],
})
export class FlightSearchComponent implements AfterViewInit {
  private element = inject(ElementRef);
  private zone = inject(NgZone);
  protected flightStore = inject(FlightStore);
  private flightService = inject(FlightService);

  from = this.flightStore.from();
  to = this.flightStore.to();

  // prettySearch = computed(() => {
  //   return `From ${this.from()} to ${this.to()}`;
  // });

  @ViewChild(NgForm) form: NgForm | undefined;

  ngAfterViewInit() {
    const valueChanges = this.form?.valueChanges;
    if (valueChanges) {
      this.flightStore.search(valueChanges);
    }
  }

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  delay(): void {
    // const oldFlights = this.flights;
    // const oldFlight = oldFlights[0];
    // const oldDate = new Date(oldFlight.date);
    //
    // const newDate = addMinutes(oldDate, 15);
    // oldFlight.date = newDate.toISOString();
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
