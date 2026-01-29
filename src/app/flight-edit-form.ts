import {Component, effect, input, output, signal} from "@angular/core";
import {Flight} from "./entities/flight";
import {form, FormField, required} from "@angular/forms/signals";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'flight-edit-form',
  imports: [
    FormField
  ],
  template: `
    <form (submit)="handleSubmit($event)">
      <div class="form-group">
        <label>From:</label>
        <input [formField]="editForm.from" class="form-control"/>
      </div>
      <div class="form-group">
        <label>To:</label>
        <input [formField]="editForm.to" class="form-control"/>
      </div>

      <div class="form-group">
        <button class="btn btn-default">Save</button>
      </div>
    </form>
  `
})
export class FlightEditForm {
  flight = input.required<Flight>()
  flightModel = signal({ id: 0, from: '', to: '', date: '', delayed: false})

  constructor() {
    effect(() => this.flightModel.set(this.flight()))
  }

  protected readonly editForm = form(this.flightModel, path => {
    required(path.id)
    required(path.from)
    required(path.to)
    required(path.date)
    required(path.delayed)
  });

  save = output<Flight>()

  protected handleSubmit($event: SubmitEvent) {
    $event.preventDefault();
    this.save.emit(this.flightModel());
  }
}
