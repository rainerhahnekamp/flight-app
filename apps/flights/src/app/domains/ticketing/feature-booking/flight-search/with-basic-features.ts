import { signalStoreFeature } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withResetState } from '@demo/ticketing/feature-booking/flight-search/with-reset-state';

export function withBasicFeatures<State extends object>(
  state: State,
  devtoolsName: string
) {
  return signalStoreFeature(withDevtools(devtoolsName), withResetState(state));
}
