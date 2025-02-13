import { signalStoreFeature } from '@ngrx/signals';
import { withLog } from './with-log';
import { withStatus } from '../with-status';
import { withLocalStorageSync } from './with-local-storage-sync';

export function withSignalStoreFeatures() {
  return signalStoreFeature(
    withStatus(),
    withLog()
    // withLocalStorageSync(localStorageKey)
  );
}
