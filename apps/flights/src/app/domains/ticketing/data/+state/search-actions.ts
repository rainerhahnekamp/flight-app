import { createActionGroup, props } from '@ngrx/store';
import { payload } from '@angular-architects/ngrx-toolkit';
import { Flight } from '@demo/ticketing/data';

export const searchActions = createActionGroup({
  source: 'Search',
  events: {
    search: props<{ from: string; to: string }>(),
    searchSuccess: props<{ flights: Flight[] }>(),
  },
});
