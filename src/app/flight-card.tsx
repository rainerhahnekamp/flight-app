import { computed, input, model } from "@angular/core";
import { Flight } from "./model/flight";

export function FlightCard() {
  const item = input.required<Flight>();
  const selected = model.required<boolean>();

  const bgColor = computed(() => ({
    "background-color": selected() ? "orange" : "lightsteelblue",
  }));

  return ng`
    @let item = this.item();

    <div style="padding: 20px" [style]="bgColor()">
      <h2>{{ item.from }} - {{ item.to }}</h2>

      <p>Flugnr. #{{ item.id }}</p>

      <p>Datum: {{ item.date | date: 'dd.MM.yyyy' }}</p>

      <p>
        <button (click)="selected.set(true)">Select</button>
        <button (click)="selected.set(false)">Deselect</button>
      </p>
    </div>`;
}
