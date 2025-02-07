import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed } from '@angular/core';

type BasketState<T> = {
  basket: Record<number, T | undefined>;
};

export function withBasket<T>() {
  return signalStoreFeature(
    withState<BasketState<T>>({ basket: {} }),
    withMethods((store) => ({
      addToBasket(id: number, value: T) {
        patchState(store, ({ basket }) => ({
          basket: { ...basket, [id]: value },
        }));
      },
      removeFromBasket(id: number) {
        const newBasket = Object.fromEntries(
          Object.entries(store.basket()).filter(([key]) => key !== String(id))
        );
        patchState(store, { basket: newBasket });
      },
    })),
    withComputed((state) => ({
      basketCount: computed(() => Object.keys(state.basket()).length),
    }))
  );
}
