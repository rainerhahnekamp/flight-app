import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

export const UserStore = signalStore(
  withDevtools('user'),
  withState({ id: 1, name: 'Konrad' })
);

/**
 * AGENDA FÜR MORGEN
 *
 * 1. Code anschauen (offene Fragen)
 * 2. Testing
 * 3. Performance (zoneless)
 */
