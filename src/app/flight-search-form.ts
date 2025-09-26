import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  model,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  isFormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { FlightSearchParams } from './model/flight-search-params';
import {
  Control,
  form,
  required,
  ValidationError,
} from '@angular/forms/signals';

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
  selector: 'app-errors',
  template: `
    @for (error of errors(); track error) {
      <p class="error">{{ error.message }}</p>
    }
  `,
})
export class ErrorComponent {
  errors = input<ValidationError[]>();
}

@Component({
  selector: `flight-search-form`,
  template: `<form (ngSubmit)="search()">
    <div class="form-group">
      <label>From:</label>
      <input
        [control]="searchForm.from"
        data-testid="inp-from"
        name="from"
        class="form-control"
      />
    </div>
    <app-errors [errors]="searchForm.from().errors()" />

    <div class="form-group">
      <label>To:</label>
      <input [control]="searchForm.to" name="to" class="form-control" />
    </div>
    <app-errors [errors]="searchForm.to().errors()" />

    <div class="form-group">
      <button
        class="btn btn-default"
        [disabled]="searchForm().invalid()"
        data-testid="btn-search"
      >
        Search
      </button>
    </div>
  </form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, Control, ErrorComponent],
})
export class FlightSearchForm {
  searched = output<FlightSearchParams>();
  searchParams = model.required<FlightSearchParams>();

  formValues = linkedSignal(this.searchParams);

  searchForm = form(this.formValues, (params) => {
    required(params.from, { message: 'Dieses Feld ist verpflichtend' });

    required(params.to, {
      message: 'Dieses Feld ist verpflichtend',
      when: (ctx) => ctx.valueOf(params.from) === 'Wien',
    });
  });

  search() {
    if (this.searchForm().valid()) {
      this.searched.emit(this.formValues());
    }
  }
}
