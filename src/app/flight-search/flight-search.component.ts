import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../models/flight';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FlightService } from '../flight.service';
import { Observable, of, Subscription } from 'rxjs';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import {
  FlightSearchFormComponent,
  SearchParams,
} from '../flight-search-form/flight-search-form.component';

const roundtripValidator: ValidatorFn = (ac) => {
  const { from, to } = ac.value;
  return from === to ? { roundtrip: from } : null;
};

const cityValidator: (allowedCities: string[]) => ValidatorFn =
  (allowedCities = ['Wien']) =>
  (ac) => {
    return allowedCities.includes(ac.value) ? null : { city: true };
  };

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FlightCardComponent,
    FlightSearchFormComponent,
    ReactiveFormsModule,
  ],
})
export class FlightSearchComponent implements OnDestroy {
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  searchParams: SearchParams = { from: 'Wien', to: 'Berlin' };
  flights: Flight[] = [];
  selectedFlight: Flight | undefined;
  message = '';
  basket = new Map<number, boolean>();
  private flightSearch = inject(FlightService);
  counter = 1;
  subscription: Subscription | undefined;

  formGroup = inject(FormBuilder).nonNullable.group(
    {
      id: [0, Validators.required],
      from: [
        '',
        [Validators.required, cityValidator(['Wien', 'London', 'Berlin'])],
      ],
      to: ['', Validators.required],
      date: ['', Validators.required],
      delayed: [false, Validators.required],
    },
    { validators: [roundtripValidator] }
  );

  constructor() {
    this.formGroup.valueChanges.subscribe(console.log);
  }

  search() {
    // Reset properties
    this.message = '';
    this.selectedFlight = undefined;

    this.subscription = this.flightSearch
      .search(this.searchParams.from, this.searchParams.to)
      .subscribe((flights) => (this.flights = flights));
  }

  save() {
    if (!this.formGroup.valid) {
      return;
    }

    // await this.flightSearch.save(this.selectedFlight);
    this.flightSearch
      .save(this.formGroup.getRawValue())
      .catch(() => (this.message = 'Flug wurde nicht gespeichert'));
    this.message = 'Flug wurde gespeichert';
  }

  select(f: Flight): void {
    this.selectedFlight = structuredClone(f);
    this.formGroup.setValue(this.selectedFlight);
  }
}
