import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ticketsFeature, TicketsState } from './tickets.reducers';

const selectState = createFeatureSelector<TicketsState>(ticketsFeature.name);

export const fromTickets = {
  selectFlights: createSelector(selectState, (state) => {
    console.log('selector flights neustart');
    return state.flights;
  }),

  selectFlightsCount: createSelector(
    ticketsFeature.selectFlights,
    (flights) => {
      console.log('selector neustart');
      return flights.length;
    }
  ),
};
