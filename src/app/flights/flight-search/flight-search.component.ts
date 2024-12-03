import {
  Component,
  inject,
  signal,
  OnDestroy,
  viewChild,
  afterNextRender,
  computed,
} from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Flight } from '../model/flight';
import {
  FormBuilder,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { CachedFlightSearchService } from '../data/cached-flight-search.service';
import { FlightCardComponent } from '../ui/flight-card.component';
import { CityErrorComponent } from '../ui/city.error';
import { RoundtripValidator } from '../ui/roundtrip.validator';
import { CityValidator, cityValidator } from '../ui/city.validator';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    FormsModule,
    FlightCardComponent,
    JsonPipe,
    AsyncPipe,
    CityValidator,
    CityErrorComponent,
    RoundtripValidator,
    ReactiveFormsModule,
  ],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent {
  from = signal('London');
  to = 'Paris';
  flights = signal<Array<Flight>>([]);
  selectedFlight: Flight | undefined;

  ngForm = viewChild.required<NgForm>('ngForm');
  formGroup = computed(() => this.ngForm().form);

  constructor(route: ActivatedRoute) {
    const flight = signal({
      id: 1,
      from: 'London',
      to: 'Paris',
      date: '2021-01-01',
      delayed: false,
      flightBookings: [],
    });

    const flightForNgModel = { ...flight() };

    // submit

    flight.set(flightForNgModel);

    afterNextRender(() => {
      const { from, to } = route.snapshot.queryParams;
      if (from && to) {
        this.from.set(from);
        this.to = to;
        this.search();
      }
    });
  }

  // basket: Array<number> = [];
  basket: Record<number, boolean> = { 1268: true };

  readonly #flightSearch = inject(CachedFlightSearchService);

  async search() {
    if (this.ngForm().form.valid) {
      this.flights.set(await this.#flightSearch.search(this.from(), this.to));
    }
  }

  message$: Observable<string> | undefined;
  message = signal('');

  getError(controlName: string, errorName: string): string {
    const errors = this.ngForm().form.controls[controlName].errors;
    if (errors && errorName in errors) {
      return errors[errorName];
    }
    return '';
  }
}
