import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import { Flight } from '@demo/ticketing/model/flight';

export const flightEvents = eventGroup({
  source: 'Flights',
  events: {
    search: type<{ from: string; to: string }>(),
    searched: type<Flight[]>(),
  },
});
