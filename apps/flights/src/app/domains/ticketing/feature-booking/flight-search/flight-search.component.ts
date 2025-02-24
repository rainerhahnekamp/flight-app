import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  resource,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '../../data';

// import { CheckinService } from '@demo/checkin/data/checkin.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent],
})
export class FlightSearchComponent {
  protected flightService = inject(FlightService);

  from = signal('');
  to = signal('');

  flights = signal<Flight[]>([]);

  async search() {
    this.flights.set(await this.flightService.find(this.from(), this.to()));
  }
}
