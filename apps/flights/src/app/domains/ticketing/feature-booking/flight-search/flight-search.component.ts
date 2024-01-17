import {
  Component,
  effect,
  ElementRef,
  inject,
  NgZone,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { CityPipe } from '@demo/shared/ui-common';
import { FlightService } from '@demo/ticketing/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, interval, map, of, pipe, tap } from 'rxjs';
import { FlightStore } from '@demo/ticketing/feature-booking/flight-search/flight-store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CityPipe,
    FlightCardComponent,
    ReactiveFormsModule,
  ],
})
export class FlightSearchComponent {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  formGroup = inject(FormBuilder).nonNullable.group({ from: [''], to: [''] });

  private flightService = inject(FlightService);
  protected flightStore = inject(FlightStore);

  constructor() {
    this.formGroup.setValue(this.flightStore.searchParams());
    // this.formGroup.valueChanges.subscribe(() => this.search());

    this.flightStore.search(
      this.formGroup.valueChanges.pipe(
        map((values) => ({
          from: values.from || '',
          to: values.to || '',
        }))
      )
    );
    const incrementer = rxMethod<number>(
      pipe(
        debounceTime(100),
        tap((value) => console.log(value + 1))
      )
    );
    const number = signal(1);
    incrementer(number);
  }

  flights = this.flightStore.flights;

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  search() {
    this.flightStore.search(this.formGroup.getRawValue());
  }

  delay() {
    this.flightStore.delay();
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
