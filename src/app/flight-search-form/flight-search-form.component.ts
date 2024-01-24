import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  NgForm,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CityValidatorDirective } from '../city-validator.directive';
import { RoundTripValidatorDirective } from '../round-trip-validator.directive';
import { AirportValidatorDirective } from '../airport-validator.directive';
import { FormlyField, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

export interface SearchParams {
  from: string;
  to: string;
}

@Component({
  selector: 'app-flight-search-form',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    CityValidatorDirective,
    RoundTripValidatorDirective,
    AirportValidatorDirective,
    FormlyModule,
  ],
  templateUrl: './flight-search-form.component.html',
  styleUrl: './flight-search-form.component.css',
})
export class FlightSearchFormComponent implements AfterViewInit {
  fields: FormlyFieldConfig[] = [
    {
      key: 'from',
      type: 'input',
      props: {
        label: 'From',
        required: true,
      },
      validators: {
        city: {
          expression: (c: AbstractControl) => c.value === 'Wien',
          message: (error: any, field: FormlyFieldConfig) =>
            `Es ist nur Wien erlaubt`,
        },
      },
    },
    {
      key: 'to',
      type: 'input',
      props: {
        label: 'To',
        required: true,
      },
    },
  ];

  formGroup = new FormGroup([]);
  @Input() searchParams = { from: '', to: '' };
  @Input() to = '';

  name = 'hallo';

  @Output() searchParamsChange = new EventEmitter<SearchParams>();
  @Output() search = new EventEmitter<void>();

  @ViewChild('form') form: NgForm | undefined;

  ngAfterViewInit(): void {
    this.form?.valueChanges?.subscribe(console.log);
  }

  handleToUpdate($event: string) {
    this.searchParamsChange.emit({ ...this.searchParams, to: $event });
  }

  handleFromUpdate($event: string) {
    this.searchParamsChange.emit({ ...this.searchParams, from: $event });
  }

  handleSearch() {
    this.search.emit();
  }
}
