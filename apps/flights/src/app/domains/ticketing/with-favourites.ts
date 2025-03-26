import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, Signal } from '@angular/core';

export function withFavourites<Type extends { id: number }>() {
  return signalStoreFeature(
    type<{ props: { entities: Signal<Type[]> } }>(),
    withState({ favourites: [] as number[] }),
    withMethods((store) => ({
      addFavourite(id: number) {
        patchState(store, (state) => ({
          favourites: [...state.favourites, id],
        }));
      },
      removeFavourite(id: number) {
        patchState(store, (state) => ({
          favourites: state.favourites.filter(
            (favouriteId) => favouriteId !== id
          ),
        }));
      },
    })),
    withComputed((state) => ({
      entitiesWithFavourite: computed(() => {
        const entities = state.entities();
        const favourites = state.favourites();

        return entities.map((entity) => ({
          ...entity,
          isFavourite: favourites.includes(entity.id),
        }));
      }),
    }))
  );
}
