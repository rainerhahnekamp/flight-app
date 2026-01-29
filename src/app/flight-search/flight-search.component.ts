import {Component, computed, inject, signal} from '@angular/core';
import {Flight} from '../entities/flight';
import {FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {FlightClient} from '../flight-client';
import {FlightCard} from '../flight-card';
import {FormField,} from '@angular/forms/signals';
import {AsyncCityValidator,} from '../forms/valid-city';
import {createForm} from '../forms/validate-search-form';
import {FlightEditForm} from "../flight-edit-form";

type Status = 'view' | 'edit';

@Component({
  selector: 'app-flight-search',
  imports: [
    FlightCard,
    ReactiveFormsModule,
    FormField,
    FlightEditForm,
    FormsModule
  ],
  templateUrl: './flight-search.component.html',
  styles: `
    .selected {
      background-color: orange;
    }
  `,
})
export class FlightSearchComponent {

  private readonly flightClient = inject(FlightClient);
  protected readonly flights = this.flightClient.flightResource;
  private readonly asyncCityValidator = inject(AsyncCityValidator);

  protected readonly status = signal<Status>('view');

  protected from = signal('Wien');
  protected to = signal('London')

  protected readonly searchParams = signal({
    from: 'Wien',
    to: 'London',
  });

  prettySearch = computed(() => {
    const {from, to} = this.searchParams();
    return `Suche von ${from} nach ${to}`;
  })

  time = signal(new Date())
  counter = signal(1);

  constructor() {
    this.search();
  }

  protected readonly searchForm = createForm(this.searchParams);

  searchSignals(event: SubmitEvent) {
    event.preventDefault();
    this.search();
  }


  protected readonly selectedFlight = signal<Flight>({id: 0, from: '', to: '', date: '', delayed: false});


  // protected editForm = inject(NonNullableFormBuilder).group({
  //   id: [0, Validators.required],
  //   from: ['', Validators.required],
  //   to: ['', Validators.required],
  //   date: ['', Validators.required],
  //   delayed: [false]
  // })

  // protected form = inject(FormBuilder).nonNullable.group(
  //   {
  //     from: [
  //       'Wien',
  //       [Validators.required, createValidateCity()],
  //       [
  //         (ac: AbstractControl<string>) =>
  //           this.asyncCityValidator.validateAsync(ac),
  //       ],
  //     ],
  //     to: [
  //       'London',
  //       [Validators.required, createValidateCity(['Eisenstadt'])],
  //       [
  //         (ac: AbstractControl<string>) =>
  //           this.asyncCityValidator.validateAsync(ac),
  //       ],
  //     ],
  //   },
  //   { validators: [validateRoundtrip] }
  // );

  basket: Record<number, boolean> = {
    115: false,
    121: true,
  };
  protected email = '';

  search() {
    const {from, to} = this.searchParams();

    this.flightClient.setSearchParams(from, to)
  }

  selectFlight(flight: Flight) {
    this.selectedFlight.set(structuredClone(flight));

    this.status.set('edit');
  }

  protected save(flight: Flight) {
    this.flightClient.save(flight).subscribe(() => {
      this.searchParams.set({from: flight.from, to: flight.to});
      this.search();
      this.status.set('view');
    });
  }
}

class Person {
  firstname: string;
  lastname: string;

  constructor(firstname: string, lastname: string) {
    this.firstname = firstname;
    this.lastname = lastname;
  }

  introduce() {
    return `Hello, my name is ${this.firstname} ${this.lastname}`;
  }
}
