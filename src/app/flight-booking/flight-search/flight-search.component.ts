import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../model/flight';
import { FormsModule } from '@angular/forms';
import { FlightService } from './flight.service';
import { CityPipe } from '../../shared/city.pipe';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent {
  from = signal('London');
  to = signal('Paris');
  message = signal('');
  flights = signal<Flight[]>([]);

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  private flightService = inject(FlightService);
  protected date = signal(new Date());

  constructor() {
    setInterval(() => this.date.set(new Date()), 1000);
  }

  search(): void {
    // Reset properties
    this.message.set('');

    this.flightService
      .find(this.from(), this.to())
      .subscribe((flights) => this.flights.set(flights));
  }

  delay(): void {
    this.flightService.delay();
  }
}
