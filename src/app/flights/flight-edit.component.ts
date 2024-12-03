import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  resource,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { cityValidator } from './ui/city.validator';
import { CachedFlightSearchService } from './data/cached-flight-search.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  template: `
    <form (ngSubmit)="saveFlight()" [formGroup]="editFlightForm">
      <input formControlName="id" class="form-control" />
      <input formControlName="from" class="form-control" />
      <input formControlName="to" class="form-control" />
      <input formControlName="date" class="form-control" />
      <input formControlName="delayed" class="form-control" />
      <input formControlName="flightBookings" class="form-control" />
      <button>Speichern</button>
    </form>

    <a [routerLink]="previousLink()">Previous</a>
    <a [routerLink]="nextLink()">Next</a>
  `,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
})
export class FlightEditComponent {
  readonly #flightService = inject(CachedFlightSearchService);
  readonly #router = inject(Router);

  id = input.required({ transform: numberAttribute });

  protected readonly editFlightForm = inject(FormBuilder).nonNullable.group({
    id: [0, [Validators.required]],
    from: ['', [Validators.required, cityValidator]],
    to: ['', [Validators.required, cityValidator]],
    date: ['', [Validators.required]],
    delayed: [false, [Validators.required]],
    flightBookings: [[] as Array<unknown>],
  });

  flight = rxResource({
    request: () => this.id(),
    loader: (options) => {
      const id = options.request;
      return this.#flightService.findById(id);
    },
  });

  constructor() {
    console.log('init');
    effect(() => {
      const flight = this.flight.value();
      if (flight) {
        this.editFlightForm.setValue(flight);
      }
    });
  }

  nextLink = computed(() => ['..', this.id() + 1]);
  previousLink = computed(() => ['..', this.id() - 1]);

  async saveFlight() {
    const flight = this.editFlightForm.getRawValue();
    await this.#flightService.save(flight);
    const { from, to } = flight;
    const url = this.#router.createUrlTree(['/flights/search'], {
      queryParams: { from, to },
    });
    this.#router.navigateByUrl(url);
  }

  handleNext() {}
}
