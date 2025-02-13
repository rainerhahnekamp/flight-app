import { signalStore, withState } from '@ngrx/signals';
import { withLog } from './with-log';
import { withStatus } from '../with-status';
import { withSignalStoreFeatures } from './with-signal-store-features';

export const HotelStore = signalStore(
  withState({ hotels: [] as string[] }),
  withSignalStoreFeatures()
);
