import { FlightState } from '@demo/ticketing/data/internal/with-flight-state';
import { Flight } from '@demo/ticketing/model/flight';
import {
  EntityProps,
  EntityState,
  NamedEntityProps,
  NamedEntityState,
} from '@ngrx/signals/entities';
import { Booking } from '@demo/ticketing/model/booking';

export type FlightStoreType = {
  state: FlightState &
    EntityState<Flight> &
    NamedEntityState<Booking, 'booking'>;
  props: EntityProps<Flight> & NamedEntityProps<Booking, 'booking'>;
};
