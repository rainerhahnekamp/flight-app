import {
  getState,
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed } from '@angular/core';

export function withLocalStorageSync(key: string) {
  return signalStoreFeature(
    withState({ lastSyncedDate: undefined as Date | undefined }),
    withComputed((state) => ({
      isSynced: computed(() => Boolean(state.lastSyncedDate)),
    })),
    withMethods((store) => ({
      syncToLocalStorage() {
        const state = getState(store);
        localStorage.setItem(key, JSON.stringify(state));
        patchState(store, { lastSyncedDate: new Date() });
      },
    })),

    withHooks((store) => ({
      onInit() {
        const state = localStorage.getItem(key);
        if (!state) {
          return;
        }

        patchState(store, JSON.parse(state));
      },
    }))
  );
}
