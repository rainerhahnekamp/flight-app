import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, ResourceStatus } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function withStatus<_>() {
  return signalStoreFeature(
    type<{
      props: { name: string };
    }>(),
    withState({
      status: ResourceStatus.Idle,
      error: undefined as Error | undefined,
    }),
    withMethods((store) => ({
      setLoading() {
        patchState(store, { status: ResourceStatus.Loading, error: undefined });
      },
      setResolved() {
        patchState(store, {
          status: ResourceStatus.Resolved,
          error: undefined,
        });
      },
      setError(error: Error) {
        patchState(store, { status: ResourceStatus.Error, error });
      },
    })),
    withComputed((state) => ({
      hasError: computed(() => state.error() !== undefined),
    }))
  );
}
