import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[onlyWien]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: OnlyWienDirective,
      multi: true,
    },
  ],
})
export class OnlyWienDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value !== 'Wien') {
      return { onlyWien: true };
    }

    return null;
  }
}
