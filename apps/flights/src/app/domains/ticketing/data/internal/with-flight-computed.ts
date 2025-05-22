import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { FlightStoreType } from '@demo/ticketing/data/internal/flight-store-type';

export function withFlightComputed() {
  return signalStoreFeature(
    type<FlightStoreType>(),
    withComputed((state) => ({
      flights: state.entities,
      prettySearch: computed(
        () =>
          `From ${state.searchParams().from} to ${state.searchParams().to}: ${
            state.entities().length
          } found`
      ),
      selectedFlight: computed(() => {
        const selectedId = state.selectedFlightId();
        const flights = state.entities();

        if (selectedId && flights.length > 0) {
          return flights.find((flight) => flight.id === selectedId);
        }

        return undefined;
      }),
    }))
  );
}
