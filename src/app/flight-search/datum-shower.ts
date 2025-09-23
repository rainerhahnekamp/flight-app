import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'datum-shower',
  template: `<p>Datum: {{ fullDate() | date: 'dd.MM.yyyy' }}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
})
export class DatumShower {
  readonly date = input.required<string>();
  protected readonly fullDate = computed(() => new Date(this.date()));
}
