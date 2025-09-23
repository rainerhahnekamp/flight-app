import { Directive, Input, input } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  isFormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { OnlyWienDirective } from './only-wien.directive';

@Directive({
  selector: '[equalFields]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EqualFieldsDirective,
      multi: true,
    },
  ],
})
export class EqualFieldsDirective implements Validator {
  @Input() equalFields: [string, string] = ['', ''];

  validate(formGroup: AbstractControl): ValidationErrors | null {
    if (!isFormGroup(formGroup)) {
      return null;
    }
    const value = formGroup.value;

    const [field1, field2] = this.equalFields;
    if (!(field1 in value || field2 in value)) {
      return null;
    }

    return value[field1] === value[field2] ? { equalFields: true } : null;
  }
}
