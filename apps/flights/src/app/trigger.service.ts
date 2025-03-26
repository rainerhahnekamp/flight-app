import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TriggerService {
  #triggerSignal = signal(1);
  triggerSignal = this.#triggerSignal.asReadonly();

  trigger() {
    this.#triggerSignal.update((value) => value + 1);
  }
}
