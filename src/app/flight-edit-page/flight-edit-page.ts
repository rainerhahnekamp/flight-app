import { httpResource } from '@angular/common/http';
import {
  Component,
  effect,
  inject,
  input,
  numberAttribute,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Control, form } from '@angular/forms/signals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FlightClient } from '../flight-client';
import { FlightStore } from '../flight-store';
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
  imports: [Control, FormsModule],
  template: `<p>Flug ID: {{ id() }}</p>
    <p>Status: {{ flights.status() }}</p>

    <form>
      <div>
        <input [control]="editForm.id" />
      </div>
      <div>
        <input [control]="editForm.from" placeholder="from" />
      </div>
      <div>
        <input [control]="editForm.to" />
      </div>
      <div>
        <input [control]="editForm.date" />
      </div>
      <div>
        <input [control]="editForm.delayed" />
      </div>
      <button type="submit" (click)="saveFlight()">Save</button>
    </form> `,
})
export class FlightEditPage {
  protected readonly id = input.required({ transform: numberAttribute });
  readonly #flightClient = inject(FlightClient);
  readonly #flightStore = inject(FlightStore);
  readonly #router = inject(Router);
  protected readonly flights = httpResource<Flight>(
    () => `https://demo.angulararchitects.io/api/flight/${this.id()}`,
    { defaultValue: emptyFlight },
  );

  protected readonly editForm = form(this.flights.value);

  readonly #snackbar = inject(MatSnackBar);

  constructor() {
    console.log();
    effect(() => {
      const status = this.flights.status();

      if (status === 'error') {
        untracked(() => this.#snackbar.open('Es trat ein Fehler auf'));
      }
    });
  }

  saveFlight() {
    if (this.editForm().valid()) {
      const flight = this.flights.value();
      this.#flightClient.save(flight).subscribe(() => {
        this.#snackbar.open('Ihr Flug wurde gespeichert', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000,
        });

        this.#router.navigateByUrl('flights/search');
      });
    }
  }
}

export default FlightEditPage;
