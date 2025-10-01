import {
  ChangeDetectionStrategy,
  Component,
  Input,
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
  maxLength,
  required,
  ValidationError,
} from '@angular/forms/signals';

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
  template: ` <form (ngSubmit)="search()">
    <div class="form-group">
      <label>From:</label>
      <input name="from" class="form-control" [control]="searchForm.from" />
    </div>
    <div class="form-group">
      <label>To:</label>
      <input name="to" class="form-control" [control]="searchForm.to" />
    </div>

    <div class="form-group">
      <button class="btn btn-default">Search</button>
    </div>
  </form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Control, FormsModule],
})
export class FlightSearchForm {
  readonly searched = output<FlightSearchParams>();
  readonly searchParams = model.required<FlightSearchParams>();

  protected readonly formValues = linkedSignal(this.searchParams);

  searchForm = form(this.formValues, (path) => {
    required(path.from, { message: 'This field is mandatory' });

    required(path.to, {
      message: 'This field is mandatory',
      when: (ctx) => ctx.valueOf(path.from) === 'Wien',
    });
  });

  search() {
    if (this.searchForm().valid()) {
      this.searched.emit(this.formValues());
    }
  }
}
