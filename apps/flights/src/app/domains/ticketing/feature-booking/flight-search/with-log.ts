import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export function withLog() {
  return signalStoreFeature(
    withState({ logHistory: [] as string[] }),
    withMethods((store) => ({
      log(msg: string) {
        patchState(store, (state) => ({
          logHistory: [...state.logHistory, msg],
        }));
        console.log(msg);
      },
    }))
  );
}
