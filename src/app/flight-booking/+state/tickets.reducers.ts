import { Flight } from '../../model/flight';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ticketsActions } from './tickets.actions';

export interface TicketsState {
  flights: Flight[];
  isLoaded: boolean;
  basket: Record<number, number>;
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
