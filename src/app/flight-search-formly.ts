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
  FormGroup,
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
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';

function inputField(key: string, label: string, required = true) {
  return {
    key,
    type: 'input',
    props: {
      label,
      placeholder: label,
      required,
    },
  };
}

@Component({
  selector: `flight-search-formly`,
  template: `<form [formGroup]="form">
    <div class="form-group">
      <formly-form
        [form]="form"
        [fields]="fields"
        [model]="model"
      ></formly-form>

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
  imports: [FormsModule, ReactiveFormsModule, FormlyForm],
})
export class FlightSearchFormly {
  searched = output<FlightSearchParams>();
  searchParams = input.required<FlightSearchParams>();

  form = new FormGroup({});
  model = { to: '', from: '' };

  fields: FormlyFieldConfig[] = [
    inputField('from', 'Von'),
    inputField('to', 'Nach'),
  ];

  constructor() {
    console.log(this.fields);
    effect(() => this.form.setValue(this.searchParams()));
  }

  search() {
    if (this.form.valid) {
      // this.searched.emit(this.form.getRawValue());
    }
  }
}
