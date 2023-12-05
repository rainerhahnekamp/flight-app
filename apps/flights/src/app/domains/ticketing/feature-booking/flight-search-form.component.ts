import { Component, inject, signal } from '@angular/core';
import { FlightService, FlightsStore } from '@demo/ticketing/data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flight-search-form',
  standalone: true,
  template: ` <form (ngSubmit)="flightStore.search(params)">
    <div class="form-group">
      <label for="from">From:</label>
      <input
        [(ngModel)]="params.from"
        id="from"
        name="from"
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label for="to">To:</label>
      <input [(ngModel)]="params.to" id="to" name="to" class="form-control" />
    </div>

    <div class="form-group">
      <button class="btn btn-default">Search</button>
    </div>
  </form>`,
  imports: [FormsModule],
})
export class FlightSearchFormComponent {
  protected flightStore = inject(FlightsStore);

  params = this.flightStore.params();
}
