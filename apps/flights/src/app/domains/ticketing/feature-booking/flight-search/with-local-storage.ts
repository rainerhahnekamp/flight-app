import {
  getState,
  patchState,
  signalStoreFeature,
  watchState,
  withHooks,
} from '@ngrx/signals';

export function withLocalStorage(key: string) {
  return signalStoreFeature(
    withHooks((store) => ({
      onInit() {
        const rawData = localStorage.getItem(key);
        if (!rawData) {
          return;
        }

        try {
          const state = JSON.parse(rawData);
          patchState(store, state);
        } catch (e) {
          console.warn(e);
        }

        watchState(store, (state) => {
          localStorage.setItem(key, JSON.stringify(state));
        });

        // listen to localstorage changes
        window.addEventListener('storage', (event) => {
          if (event.key === key) {
            const state = JSON.parse(event.newValue || '{}');
            patchState(store, state);
          }
        });
      },
    }))
  );
}
