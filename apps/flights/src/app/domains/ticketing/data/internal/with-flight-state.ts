import {
  signalStoreFeature,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Flight } from '@demo/ticketing/model/flight';
import { Booking } from '@demo/ticketing/model/booking';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';

export interface FlightState {
  searchParams: { from: string; to: string };
  selectedFlightId: number | undefined;
  basket: Record<number, boolean>;
  date: Date;
  message: string;
}

const initialState: FlightState = {
  searchParams: { from: 'Wien', to: 'Frankfurt' },
  selectedFlightId: undefined,
  basket: {},
  date: new Date(),
  message: '',
};

type;

export function withFlightState() {
  return signalStoreFeature(
    withState(initialState),
    withEntities<Flight>(),
    withEntities({ entity: type<Booking>(), collection: 'booking' })
  );
}
