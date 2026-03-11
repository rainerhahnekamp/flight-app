import { inject, Signal } from '@angular/core';
import { Flight } from '@demo/ticketing/data';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Dispatcher } from '@ngrx/signals/events';
import { appEvents } from './events';

export function withSelected<Entity extends { id: number }>(
  name: string,
  entities: Signal<Entity[]>
) {
  return signalStoreFeature(
    withState({
      _selectedId: undefined as number | undefined,
    }),
    withComputed((store) => ({
      _selectedEntity: () => {
        return entities().find((e) => e.id === store._selectedId());
      },
    })),
    withMethods((store, dispatcher = inject(Dispatcher)) => ({
      select(id: number) {
        const hasEntity = entities().find((e) => e.id === id);

        if (!hasEntity) {
          throw new Error(`${name} does not exist`);
        }

        patchState(store, { _selectedId: id });

        const selectedEntity = store._selectedEntity();
        if (selectedEntity) {
          dispatcher.dispatch(
            appEvents.flightSelected(selectedEntity as unknown as Flight)
          );
        }
      },
      unselect() {
        patchState(store, { _selectedId: undefined });
      },
    }))
  );
}
