import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class Basket {
  readonly #httpClient = inject(HttpClient);
  readonly #basket: Array<number> = [];

  addFlight(id: number) {
    this.#httpClient.post;
  }

  removeFlight(id: number): void {}
}
