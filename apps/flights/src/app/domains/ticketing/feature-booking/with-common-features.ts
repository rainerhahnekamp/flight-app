import { signalStoreFeature } from '@ngrx/signals';
import { withStatus } from './with-status';

export function withCommonFeatures() {
  return signalStoreFeature(withStatus());
}
