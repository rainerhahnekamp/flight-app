import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';
import { ResourceStatus } from '@angular/core';

export function setLoading() {
  return { status: 'loading' as ResourceStatus, error: undefined };
}

export function setLoaded() {
  return { status: 'resolved' as ResourceStatus, error: undefined };
}

export function withLoadingStatus() {
  return signalStoreFeature(
    withState({
      status: 'idle' as ResourceStatus,
      error: undefined as unknown,
    }),
    withComputed(({ status, error }) => ({
      isLoading: () => status() === 'loading',
      hasError: () => Boolean(error),
      hasValue: () => ['local', 'resolved'].includes(status()),
    }))
  );
}
