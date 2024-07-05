import { createFeature, createReducer, on } from '@ngrx/store';
import { ticketsActions } from './tickets.actions';
import { Flight } from '@demo/ticketing/data';

export interface TicketsState {
  flights: Flight[];
  isLoaded: boolean;
  basket: Record<number, number>;
}

export interface TicketsAppState {
  tickets: TicketsState;
}

const initialState: TicketsState = { flights: [], isLoaded: false, basket: {} };

export const ticketsFeature = createFeature({
  name: 'tickets',
  reducer: createReducer(
    initialState,

    on(ticketsActions.flightsLoaded, (state, action) => {
      const newState = { ...state };
      newState.flights = action.flights;

      return newState;
    }),
    on(ticketsActions.toggleLoaded, (state, action) => {
      const newState = { ...state };
      newState.isLoaded = !newState.isLoaded;
      return newState;
    })
  ),
});
