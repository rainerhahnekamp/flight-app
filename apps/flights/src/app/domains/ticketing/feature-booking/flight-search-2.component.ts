import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  NgForm,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { asyncValidateCity, CityValidator, validateCity } from './city.ng';
import { JsonPipe } from '@angular/common';
import { FlightService } from '../data';
import { validateRoundTrip } from '../../shared/util-validation';
import { validateFlights } from './roundtrip.validator';

@Component({
  template: `<h1>Flight Search</h1>
    <form [formGroup]="formGroup" (ngSubmit)="search()">
      <div class="form-group">
        <label for="from">From:</label>
        <input id="from" formControlName="from" class="form-control" />
        @if (formGroup.controls['from'].invalid) {
        <p>Input is invalid</p>
        }
      </div>
      <div class="form-group">
        <label for="to">To:</label>
        <input id="to" class="form-control" formControlName="to" />
        @if (formGroup.controls['to'].invalid) {
        <p>Input is invalid</p>
        }
      </div>

      <div class="form-group">
        <button [disabled]="formGroup.invalid">Search</button>
      </div>
    </form> `,
  imports: [FormsModule, ReactiveFormsModule],
})
export class FlightSearch2Component {
  flightService = inject(FlightService);
  formGroup = inject(NonNullableFormBuilder).group(
    {
      from: [
        'Wien',
        [Validators.required],
        asyncValidateCity(this.flightService),
      ],
      to: ['', [Validators.required], asyncValidateCity(this.flightService)],
    },
    { validators: [validateFlights], updateOn: 'blur' }
  );

  search() {
    console.log('searching');
  }
}
