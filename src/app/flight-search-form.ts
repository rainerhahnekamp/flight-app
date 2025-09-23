import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  isFormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FlightSearchParams } from './model/flight-search-params';
import { OnlyWienDirective } from './only-wien.directive';
import { EqualFieldsDirective } from './equal-fields.directive';
import { JsonPipe } from '@angular/common';

const onlyWien = (control: AbstractControl): ValidationErrors | null => {
  if (control.value !== 'Wien') {
    return { onlyWien: true };
  }

  return null;
};

function equalFields(equalFields: [string, string]) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    if (!isFormGroup(formGroup)) {
      return null;
    }
    const value = formGroup.value;

    const [field1, field2] = equalFields;
    if (!(field1 in value || field2 in value)) {
      return null;
    }

    return value[field1] === value[field2] ? { equalFields: true } : null;
  };
}

@Component({
  selector: `flight-search-form`,
  template: `<form [formGroup]="form">
    <div class="form-group">
      <label>From:</label>
      <input formControlName="from" name="from" class="form-control" />
    </div>

    @if (form.controls['from'] && form.controls['from'].hasError('required')) {
      <p>Feld muss ausgefüllt sein</p>
    }
    @if (form.controls['from'].hasError('onlyWien')) {
      <p>Nur Wien hat einen Flughafen</p>
    }
    <div class="form-group">
      <label>To:</label>
      <input formControlName="to" name="to" class="form-control" />
    </div>

    <!--    @if (form.controls['from'].value === form.controls['to'].value) {-->
    <!--      <p>Werte dürfen nicht gleich sein.</p>-->
    <!--    }-->

    @if (form.hasError('equalFields')) {
      <p>Start und Ziel dürfen nicht gleich sein.</p>
    }
    <div class="form-group">
      <button
        (click)="search()"
        class="btn btn-default"
        [disabled]="form.invalid"
      >
        Search
      </button>
    </div>
  </form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule],
})
export class FlightSearchForm {
  searched = output<FlightSearchParams>();
  searchParams = input.required<FlightSearchParams>();

  form = inject(FormBuilder).nonNullable.group(
    {
      from: ['', [Validators.required, onlyWien]],
      to: ['', Validators.required],
    },
    { validators: [equalFields(['from', 'to'])] },
  );

  constructor() {
    effect(() => this.form.setValue(this.searchParams()));
  }

  search() {
    if (this.form.valid) {
      this.searched.emit(this.form.getRawValue());
    }
  }
}
