/**
 * Requirements:
 *
 * 1. State is loaded from localStorage in the beginning
 * 2. exposes a method sync(): void
 */
import {
  getState,
  patchState,
  signalStore,
  signalStoreFeature,
  type,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { parse } from 'date-fns';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export function withLocalStorageSync(key: string) {
  return signalStoreFeature(
    withMethods((store) => {
      return {
        async sync() {
          const state = getState(store);
          localStorage.setItem(key, JSON.stringify(state));
        },
      };
    }),
    withHooks((store) => ({
      onInit() {
        const serializedState = localStorage.getItem(key);
        if (!serializedState) {
          return;
        }

        const state = JSON.parse(serializedState);
        patchState(store, state);
      },
    }))
  );
}
