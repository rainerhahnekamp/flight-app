import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { Flight } from '../entities/flight';
import {
  form,
  FormField,
  minLength,
  required,
  submit,
  validate,
  validateHttp,
} from '@angular/forms/signals';
import { FlightService } from '../flight-service';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightEditFormComponent } from '../flight-edit-form.component';
import { JsonPipe } from '@angular/common';
import { FlightStore } from '../flight-store';
import { Config } from '../config';

interface SearchModel {
  from: string;
  to: string;
}

@Component({
  selector: 'app-flight-search',
  imports: [FormField, FlightCardComponent, JsonPipe],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.css',
})
export class FlightSearchComponent {
  private readonly flightStore = inject(FlightStore);
  private readonly config = inject(Config);

  readonly searchModel = signal<SearchModel>({ from: '', to: '' });

  readonly searchForm = form(this.searchModel, (schemaPath) => {
    required(schemaPath.from, { message: 'This field is required.' });
    minLength(schemaPath.from, 3, {
      message: 'This field has a minimal length of 3.',
    });
    validateHttp(schemaPath.from, {
      request: ({ value }) =>
        value() ? `${this.config.baseUrl}/flight?from=&to=` : undefined,
      onSuccess: (response: Flight[], { value }) => {
        const cities = new Set((response ?? []).flatMap((f) => [f.from, f.to]));
        return cities.has(value() ?? '')
          ? null
          : {
              kind: 'city',
              message: 'This city is not allowed.',
              allowedCities: [...cities],
            };
      },
      onError: () => ({
        kind: 'networkError',
        message: 'Could not verify city.',
      }),
    });

    required(schemaPath.to, { message: 'This field is required.' });
    validateHttp(schemaPath.to, {
      request: ({ value }) =>
        value() ? `${this.config.baseUrl}/flight?from=&to=` : undefined,
      onSuccess: (response: Flight[], { value }) => {
        const cities = new Set((response ?? []).flatMap((f) => [f.from, f.to]));
        return cities.has(value() ?? '')
          ? null
          : {
              kind: 'city',
              message: 'This city is not allowed.',
              allowedCities: [...cities],
            };
      },
      onError: () => ({
        kind: 'networkError',
        message: 'Could not verify city.',
      }),
    });

    validate(schemaPath.to, ({ value, valueOf }) =>
      value() === valueOf(schemaPath.from)
        ? { kind: 'roundtrip', message: 'Roundtrips are not allowed.' }
        : null,
    );
  });

  private storeSyncEffect = effect(() => {
    const from = this.flightStore.from();
    const to = this.flightStore.to();
    untracked(() => this.searchModel.set({ from, to }));
  });

  readonly flights = this.flightStore.flights;

  basket: Record<number, boolean> = {
    1: true,
  };

  readonly message = computed(() => {
    switch (this.flights.status()) {
      case 'idle':
        return '';
      case 'loading':
        return 'Searching...';
      case 'resolved':
        return 'Search successful';
      case 'error':
        return 'Search failed';
    }
    return '';
  });

  flightService = inject(FlightService);
  selectedFlight = signal<Flight | undefined>(undefined);

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.searchForm, async () => {
      const { from, to } = this.searchModel();
      this.flightStore.setSearchParams(from, to);
    });
  }

  selectFlight(flight: Flight) {
    this.selectedFlight.set({ ...flight });
  }

  editFlight(flight: Flight) {
    this.selectedFlight.set({ ...flight });
  }

  save(flight: Flight) {
    this.flightService.save(flight).subscribe({
      next: (updated) => {
        this.flightStore.setSearchParams(updated.from, updated.to);
        this.selectedFlight.set(undefined);
      },
    });
  }

  protected readonly input = input;
}
