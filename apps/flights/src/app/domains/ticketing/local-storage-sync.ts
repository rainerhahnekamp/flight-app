import {
  getState,
  patchState,
  signalStore,
  signalStoreFeature,
  withHooks,
  withMethods,
} from '@ngrx/signals';

export function withLocalStorageSync(key: string) {
  return signalStoreFeature(
    withMethods((store) => ({
      sync() {
        const state = getState(store);
        localStorage.setItem(key, JSON.stringify(state));
      },
      _restore() {
        const raw = localStorage.getItem(key);

        if (raw === null) {
          return;
        }

        patchState(store, JSON.parse(raw));
      },
    })),
    withHooks((store) => ({
      onInit() {
        store._restore();
      },
    }))
  );
}
