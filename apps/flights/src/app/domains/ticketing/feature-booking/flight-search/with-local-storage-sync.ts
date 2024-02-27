import {
  getState,
  patchState,
  signalStoreFeature,
  withHooks,
  withMethods,
} from '@ngrx/signals';

export const withLocalStorageSync = (key: string, automaticRestore = true) =>
  signalStoreFeature(
    withMethods((store) => {
      return {
        sync() {
          const state = getState(store);
          window.localStorage.setItem(key, JSON.stringify(state));
        },
        syncFromLocalStorage() {
          const serialisedState = window.localStorage.getItem(key);
          if (serialisedState) {
            patchState(store, JSON.parse(serialisedState));
            return true;
          }

          return false;
        },
      };
    }),
    withHooks((store) => {
      return {
        onInit() {
          if (automaticRestore) {
            store.syncFromLocalStorage();
          }
        },
      };
    })
  );
