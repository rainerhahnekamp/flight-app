import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

function addFavourite(id: number) {
  return (state: { favouriteIds: number[] }) => ({
    favouriteIds: [...state.favouriteIds, id],
  });
}
export function withFavourites() {
  return signalStoreFeature(
    withState({ favouriteIds: [] as number[] }),
    withMethods((store) => ({
      addFavourite(id: number) {
        // patchState(store, ({ favouriteIds }) => ({ favouriteIds: [...favouriteIds, id] }))
        patchState(store, addFavourite(id));
      },
      removeFavourite(id: number) {
        patchState(store, ({ favouriteIds }) => ({
          favouriteIds: favouriteIds.filter((fid) => fid !== id),
        }));
      },
    })),
    withComputed((state) => ({
      hasFavourites: () => state.favouriteIds().length > 0,
    }))
  );
}
