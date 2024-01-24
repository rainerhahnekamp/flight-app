import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SearchParams {
  from: string;
  to: string;
}

@Component({
  selector: 'app-flight-search-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './flight-search-form.component.html',
  styleUrl: './flight-search-form.component.css',
})
export class FlightSearchFormComponent {
  @Input() searchParams = { from: '', to: '' };
  @Input() to = '';

  @Output() searchParamsChange = new EventEmitter<SearchParams>();
  @Output() search = new EventEmitter<void>();

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
