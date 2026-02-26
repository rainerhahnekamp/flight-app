import { Component, computed, inject, OnInit } from '@angular/core';
import { FlightStore } from '../flight-store';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sidebar-cmp',
  templateUrl: 'sidebar.component.html',
  imports: [RouterLink],
})
export class SidebarComponent {
  flightsCount = inject(FlightStore).flightsCount;
}
