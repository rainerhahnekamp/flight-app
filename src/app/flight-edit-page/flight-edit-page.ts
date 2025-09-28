import { httpResource } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Control, form, required, validateTree } from '@angular/forms/signals';
import { Router } from '@angular/router';
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
  imports: [ReactiveFormsModule, Control],
  template: `
    <h2>Flight Edit</h2>

    <form (ngSubmit)="saveFlight()" class="col-md-4">
      <div class="form-group">
        <label>ID</label>
        <input [control]="editForm.id" class="form-control" />
      </div>
      <div class="form-group">
        <label>From</label>
        <input [control]="editForm.from" class="form-control" />
        @for (error of editForm.from().errors(); track error.message) {
          <p class="error">{{ error.message }}</p>
        }
      </div>
      <div class="form-group">
        <label>To</label>
        <input [control]="editForm.to" class="form-control" />
      </div>
      <div class="form-group">
        <label>Date</label>
        <input [control]="editForm.date" class="form-control" />
      </div>
      <div class="form-group">
        <label>Delayed</label>
        <input
          [control]="editForm.delayed"
          type="checkbox"
          class="form-control"
        />
      </div>
      <button>Save</button>
    </form>
  `,
})
export default class FlightEditPage {
  readonly #flightClient = inject(FlightClient);
  readonly #router = inject(Router);

  readonly id = input.required<number>();

  readonly flight = httpResource<Flight>(
    () => ({
      url: `https://demo.angulararchitects.io/api/flight/${this.id()}`,
    }),
    {
      defaultValue: emptyFlight,
    },
  );

  editForm = form(this.flight.value, (path) => {
    required(path.id, {
      message: 'This field is mandatory',
    });
    required(path.from, {
      message: 'This field is mandatory',
      when: (ctx) => Boolean(ctx.valueOf(path.to)),
    });
    required(path.to, { message: 'This field is mandatory' });
    required(path.date, { message: 'This field is mandatory' });
    required(path.delayed, { message: 'This field is mandatory' });

    validateTree(path, (ctx) => {
      const from = ctx.field.from().value();
      const to = ctx.field.to().value();

      if (from === to) {
        return {
          kind: 'custom',
          field: ctx.field.from,
          message: 'From and To must be different',
        };
      }

      return null;
    });
  });

  saveFlight() {
    if (this.editForm().valid()) {
      const flight = this.flight.value();

      console.log(flight);
      // this.#flightClient.save(flight).subscribe(() => {
      //   void this.#router.navigateByUrl('flights/search');
      // });
    }
  }
}
