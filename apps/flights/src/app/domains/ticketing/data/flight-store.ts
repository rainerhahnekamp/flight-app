import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Flight } from '@demo/ticketing/model/flight';
import { computed, inject } from '@angular/core';
import { FlightService } from '@demo/ticketing/data/index';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withLocalStorageSync } from '@demo/shared/ngrx-features/with-local-storage-sync';
import { withFlightState } from '@demo/ticketing/data/internal/with-flight-state';
import { withFlightComputed } from '@demo/ticketing/data/internal/with-flight-computed';
import { withFlightMethods } from '@demo/ticketing/data/internal/with-flight-methods';

// standardization
// automatic slices
// private state
// automatic shallow cloning
// RxJS integration
// Encapsulation, protected state
// Extensibility

export const FlightStore = signalStore(
  { providedIn: 'root' },
  withDevtools('flights'),
  withFlightState(),
  withLocalStorageSync('flights'),
  withFlightComputed(),
  withFlightMethods()
);
