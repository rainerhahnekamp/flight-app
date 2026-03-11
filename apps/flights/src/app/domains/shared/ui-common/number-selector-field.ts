import { Component, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-number-selector',
  template: `
    <div>
      <button (click)="value.set(1)">1</button>
      <button (click)="value.set(2)">2</button>
      <button (click)="value.set(3)">3</button>
    </div>
  `,
})
export class NumberSelectorField implements FormValueControl<number> {
  value = model(0);
}
