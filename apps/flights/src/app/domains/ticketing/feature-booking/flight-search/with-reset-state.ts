import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export function withResetState<State extends object>(state: State) {
  return signalStoreFeature(
    withState(state),
    withMethods((store) => ({
      reset() {
        patchState(store, state);
      },
    }))
  );
}
