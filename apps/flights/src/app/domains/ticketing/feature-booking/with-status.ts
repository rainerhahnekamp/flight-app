import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed } from '@angular/core';

type StatusState = {
  status: 'none' | 'loading' | 'loaded' | 'error';
};

const initialState: StatusState = {
  status: 'none',
};

export function withStatus() {
  return signalStoreFeature(
    withState(initialState),
    withMethods((store) => ({
      setLoading() {
        patchState(store, { status: 'loading' });
      },
      setLoaded() {
        patchState(store, { status: 'loaded' });
      },
    })),
    withComputed((state) => ({
      isReady: computed(() => state.status() === 'loaded'),
    }))
  );
}
