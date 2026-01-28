import { Component, computed } from '@angular/core';
import { input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'form-error',
  template: `
    @if (errorsMap()['required']) {
    <p>Das Feld muss ausgefüllt sein.</p>
    } @if (errorsMap()['city']) {
    <p>
      Diese Stadt ist nicht erlaubt. Gültige Eingaben: {{ errorsMap()['city'] }}
    </p>
    } @if(errorsMap()['validCity']) {
    <p>Diese Stadt wird nicht angeflogen</p>
    }
  `,
})
export class FormErrors {
  errors = input<ValidationErrors | null>(null);
  errorsMap = computed<Record<string, unknown>>(() => {
    const errors = this.errors();

    if (errors === null) {
      return {};
    }

    return errors;
  });
}
