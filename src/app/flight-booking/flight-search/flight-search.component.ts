import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../model/flight';
import { FormsModule } from '@angular/forms';
import { FlightService } from './flight.service';
import { CityPipe } from '../../shared/city.pipe';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { DateCvaDirective } from 'src/app/shared/date/date-cva.directive';
import { DateStepperComponent } from 'src/app/shared/date/date-stepper/date-stepper.component';
import { first, lastValueFrom, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ticketsActions } from '../+state/tickets.actions';
import { ticketsFeature } from '../+state/tickets.reducers';
import { fromTickets } from '../+state/tickets.selectors';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CityPipe,
    FlightCardComponent,
    DateCvaDirective,
    DateStepperComponent,
  ],
})
export class FlightSearchComponent {
  from = 'London';
  to = 'Paris';
  flights: Array<Flight> = [];
  selectedFlight: Flight | undefined;
  message = '';
  date = new Date();

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  private store = inject(Store);
  flights$ = this.store.select(fromTickets.selectFlights);
  flightsCount$ = this.store.select(fromTickets.selectFlightsCount);
  loaded$ = this.store.select(ticketsFeature.selectIsLoaded);

  search() {
    this.store.dispatch(
      ticketsActions.loadFlights({ from: this.from, to: this.to })
    );
  }

  select(f: Flight): void {
    this.selectedFlight = { ...f };
  }

  toggleLoaded() {
    this.store.dispatch(ticketsActions.toggleLoaded());
  }
}
