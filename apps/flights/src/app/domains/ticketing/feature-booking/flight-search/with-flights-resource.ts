import { signalStoreFeature, type, withProps } from '@ngrx/signals';
import { httpResource } from '@angular/common/http';
import { parseFlightSchema } from '@demo/ticketing/data';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function withFlightsResource<_>() {
  return signalStoreFeature(
    type<{
      state: { searchParams: { from: string; to: string } };
    }>(),
    withProps((store) => ({
      _flightsResource: httpResource(
        () => {
          const { from, to } = store.searchParams();
          if (!from || !to) {
            return undefined;
          }
          return {
            url: 'https://demo.angulararchitects.io/api/flight',
            params: { from, to },
          };
        },
        {
          defaultValue: [],
          parse: parseFlightSchema,
        }
      ),
    }))
  );
}
