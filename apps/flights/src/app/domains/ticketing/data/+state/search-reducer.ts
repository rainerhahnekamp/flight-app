import { Flight } from '@demo/ticketing/data';
import { createFeature, createReducer, on } from '@ngrx/store';
import { searchActions } from '@demo/ticketing/data/+state/search-actions';
import { state } from '@angular/animations';

export interface SearchState {
  searchParams: {
    from: string;
    to: string;
  };
  flights: Flight[];
}

const initialState: SearchState = {
  searchParams: {
    from: 'Paris',
    to: 'London',
  },
  flights: [],
};

export const searchFeature = createFeature({
  name: 'flightSearch',
  reducer: createReducer(
    initialState,
    on(searchActions.searchSuccess, (state, action) => {
      const newState = { ...state };
      newState.flights = action.flights;
      return newState;
    })
  ),
});
