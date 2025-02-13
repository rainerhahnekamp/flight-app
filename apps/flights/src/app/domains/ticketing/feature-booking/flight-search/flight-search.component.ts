import { Component, computed, inject, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightService } from '@demo/ticketing/data';
import { FlightStore } from './flight-store';
import { PatientStore } from './patient-store';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent],
  providers: [FlightStore, PatientStore],
})
export class FlightSearchComponent {
  protected flightStore = inject(FlightStore);
  private flightService = inject(FlightService);

  from = signal('');
  to = signal('');
  searchActive = false;
  searchParams = computed(() => ({ from: this.from(), to: this.to() }));

  flightsResource = resource({
    request: this.searchParams,
    loader: () => {
      const { from, to } = this.searchParams();
      if (!(from && to)) {
        return Promise.resolve(undefined);
      }

      return this.flightService.findPromise(from, to);
    },
  });

  flights = computed(() => this.flightsResource.value() ?? []);

  constructor() {}

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  connect() {}

  search() {
    resource({
      request: this.searchParams,
      loader: () => Promise.resolve(true),
    });
    this.searchActive = true;
    this.flightsResource.reload();
  }
}
