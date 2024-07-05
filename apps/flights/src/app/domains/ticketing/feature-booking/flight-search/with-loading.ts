import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed } from '@angular/core';

export const withLoading = () =>
  signalStoreFeature(
    withState({ loading: false }),
    withMethods((store) => {
      return {
        setLoading() {
          patchState(store, { loading: true });
        },
        setLoaded() {
          patchState(store, { loading: false });
        },
      };
    })
  );
