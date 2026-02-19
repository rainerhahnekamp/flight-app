import {
  Component,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Flight } from './entities/flight';
import { validateCity } from './forms/validate-city';

@Component({
  selector: 'app-flight-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="submit()">
      <div>
        <label for="edit-from">From</label>
        <input id="edit-from" formControlName="from" />
        @if (formGroup.controls['from'].hasError('required')) {
          <p>This field is required.</p>
        }
        @if (formGroup.controls['from'].hasError('minlength')) {
          <p>Min length {{ formGroup.controls['from'].getError('minlength').requiredLength }}.</p>
        }
      </div>
      <div>
        <label for="edit-to">To</label>
        <input id="edit-to" formControlName="to" />
        @if (formGroup.controls['to'].hasError('required')) {
          <p>This field is required.</p>
        }
      </div>
      <div>
        <label for="edit-date">Date</label>
        <input id="edit-date" type="date" formControlName="date" />
        @if (formGroup.controls['date'].hasError('required')) {
          <p>This field is required.</p>
        }
      </div>
      <div>
        <label>
          <input type="checkbox" formControlName="delayed" />
          Delayed
        </label>
      </div>
      <button type="submit" [disabled]="formGroup.invalid">Save</button>
      <button type="button" (click)="cancel.emit()">Cancel</button>
    </form>
  `,
})
export class FlightEditFormComponent {
  readonly flight = input.required<Flight>();
  readonly save = output<Flight>();
  readonly cancel = output<void>();

  readonly formGroup: FormGroup = inject(FormBuilder).group({
    from: ['', [Validators.required, Validators.minLength(3), validateCity()]],
    to: ['', [Validators.required, validateCity()]],
    date: ['', Validators.required],
    delayed: [false],
  });

  constructor() {
    effect(() => {
      const f = this.flight();
      untracked(() =>
        this.formGroup.patchValue({
          from: f.from,
          to: f.to,
          date: f.date,
          delayed: f.delayed,
        })
      );
    });
  }

  protected submit(): void {
    if (this.formGroup.invalid) return;
    const value = this.formGroup.getRawValue();
    this.save.emit({
      id: this.flight().id,
      from: value.from,
      to: value.to,
      date: value.date,
      delayed: value.delayed,
    });
  }
}
