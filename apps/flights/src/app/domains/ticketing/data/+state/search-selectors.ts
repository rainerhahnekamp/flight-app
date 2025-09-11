import { createSelector } from '@ngrx/store';
import { searchFeature } from '@demo/ticketing/data/+state/search-reducer';

export const selectFlightsCount = createSelector(
  searchFeature.selectFlights,
  (flights) => flights.length
);
