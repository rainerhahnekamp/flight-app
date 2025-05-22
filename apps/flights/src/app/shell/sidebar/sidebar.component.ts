import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlightStore } from '@demo/ticketing/data/flight-store';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})
export class SidebarComponent {
  readonly #flightStore = inject(FlightStore);
  flights = computed(() => this.#flightStore.flights().length);
}
