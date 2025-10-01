import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ResourceStatus } from '@angular/core';
import { withEntities } from '@ngrx/signals/entities';

export function withBasisFeature<T>() {
  return signalStoreFeature(withStatus(), withEntities<T>());
}

export function withStatus() {
  return signalStoreFeature(
    withState({
      status: 'idle' as ResourceStatus,
      error: undefined as unknown,
    }),
    withComputed((store) => ({
      isLoading: () => store.status() === 'loading',
      hasValue: () =>
        store.status() === 'resolved' || store.status() === 'local',
    })),
    withMethods((store) => ({
      resetStatus() {
        patchState(store, { status: 'idle', error: undefined });
      },
    })),
  );
}
