import { Flight } from '@demo/ticketing/data';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const appEvents = eventGroup({
  source: 'app',
  events: {
    flightSelected: type<Flight>(),
  },
});
