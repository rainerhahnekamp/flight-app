import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Flight } from '@demo/ticketing/data';

export const ticketsActions = createActionGroup({
  source: 'tickets',
  events: {
    'load flights': props<{ from: string; to: string }>(),
    'flights loaded': props<{ flights: Flight[] }>(),
    'toggle loaded': emptyProps(),
  },
});
