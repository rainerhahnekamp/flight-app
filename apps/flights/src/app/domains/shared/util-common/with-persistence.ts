import { signalStoreFeature, watchState, withHooks } from '@ngrx/signals';

export function withPersistence(name: string) {
  return signalStoreFeature(
    withHooks((store) => ({
      onInit() {
        watchState(store, (state) => {
          localStorage.setItem(name, JSON.stringify(state));
        });
      },
    }))
  );
}
