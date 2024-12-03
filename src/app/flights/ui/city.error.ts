import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-city-error',
  template: `
    @if (hasError()) {
      <div class="error">
        Diese Stadt ist nicht erlaubt. Erlaubt sind:
        {{ getError('to', 'city') }}
      </div>
    }
  `,
})
export class CityErrorComponent {
  ac = input.required<AbstractControl>();

  hasError() {
    return this.ac().hasError('city');
  }

  getError(controlName: string, errorName: string): string {
    const errors = this.ac().errors;
    if (errors && errorName in errors) {
      return errors[errorName];
    }
    return '';
  }
}
