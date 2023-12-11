import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsStore } from '@demo/ticketing/data';

@Component({
  selector: 'app-status-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-toggle.component.html',
  styleUrls: ['./status-toggle.component.css'],
})
export class StatusToggleComponent {
  @Input() status = false;
  @Output() statusChange = new EventEmitter<boolean>();
  @Output() toggleExpand = new EventEmitter<void>();

protected flightsStore = inject(FlightsStore);
  toggle(): void {
    this.status = !this.status;
    this.statusChange.next(this.status);
  }
}
