import {
  patchState,
  signalStore,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export function withFavourites<_>() {
  return signalStoreFeature(
    withState({ favouriteIds: [] as number[] }),
    withMethods((store) => ({
      addFavouriteId(id: number) {
        patchState(store, { favouriteIds: [...store.favouriteIds(), id] });
      },
      removeFavouriteId(id: number) {
        patchState(store, {
          favouriteIds: store.favouriteIds().filter((i) => i !== id),
        });
      },
      resetFavourites() {
        patchState(store, { favouriteIds: [] });
      },
    }))
  );
}
