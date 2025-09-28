import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { FlightClient } from '../flight-client';
import { Flight } from '../model/flight';

const emptyFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
};

@Component({
  selector: 'app-flight-edit-page',
  imports: [ReactiveFormsModule],
  template: `
    <h2>Flight Edit</h2>

    <form (ngSubmit)="saveFlight()" [formGroup]="editForm" class="col-md-4">
      <div class="form-group">
        <label>ID</label>
        <input formControlName="id" class="form-control" />
      </div>
      <div class="form-group">
        <label>From</label>
        <input formControlName="from" class="form-control" />
      </div>
      <div class="form-group">
        <label>To</label>
        <input formControlName="to" class="form-control" />
      </div>
      <div class="form-group">
        <label>Date</label>
        <input formControlName="date" class="form-control" />
      </div>
      <div class="form-group">
        <label>Delayed</label>
        <input formControlName="delayed" type="checkbox" class="form-control" />
      </div>
      <button>Save</button>
    </form>
  `,
})
export default class FlightEditPage {
  readonly #flightClient = inject(FlightClient);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  constructor() {
    this.#route.params
      .pipe(
        map((params) => Number(params['id'])),
        filter(Boolean),
        switchMap((id) => this.#flightClient.findById(id)),
        takeUntilDestroyed(),
      )
      .subscribe((flight) => {
        this.editForm.patchValue(flight);
      });
  }

  protected readonly editForm = inject(FormBuilder).nonNullable.group({
    id: [0, Validators.required],
    from: ['', Validators.required],
    to: ['', Validators.required],
    date: ['', Validators.required],
    delayed: [false, Validators.required],
  });

  saveFlight() {
    if (this.editForm.valid) {
      const flight = this.editForm.getRawValue();
      this.#flightClient.save(flight).subscribe(() => {
        void this.#router.navigateByUrl('flights/search');
      });
    }
  }
}
