import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightCard } from './flight-card';
import { FlightStore } from './flight-store.service';

@Component({
  selector: 'app-flight-search',
  template: `<div class="header">
      <h2 class="title">Flight Search</h2>
    </div>

    <form (ngSubmit)="search()">
      <div class="form-group">
        <label>From:</label>
        <input name="from" class="form-control" [(ngModel)]="from" required />
      </div>
      <div class="form-group">
        <label>To:</label>
        <input name="to" class="form-control" [(ngModel)]="to" required />
      </div>

      <div class="form-group">
        <!--        <button class="btn btn-default">Search</button>-->
      </div>
    </form>

    @if (flightStore.hasValue()) {
      <div class="row">
        @for (flight of flightStore.value(); track $index) {
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <app-flight-card [flight]="flight"></app-flight-card>
          </div>
        }
      </div>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, FlightCard],
})
export default class FlightSearchPage {
  protected readonly flightStore = inject(FlightStore);
  protected readonly from = linkedSignal(
    () => this.flightStore.searchParams().from,
  );
  protected readonly to = linkedSignal(
    () => this.flightStore.searchParams().to,
  );

  protected readonly searchParams = computed(() => ({
    from: this.from(),
    to: this.to(),
  }));

  constructor() {
    this.flightStore.search(this.searchParams);
  }

  search(): void {
    // this.flightStore.search(this.from(), this.to());
  }
}
