import { Component, inject } from '@angular/core';
import { FlightStore } from '@demo/ticketing/feature-booking/flight-search/flight-store';

@Component({
  standalone: true,
  selector: 'app-navbar-cmp',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent {
  sidebarVisible = false;

  protected readonly flightStore = inject(FlightStore);

  sidebarToggle() {
    const body = document.getElementsByTagName('body')[0];

    if (this.sidebarVisible == false) {
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
    }
  }
}
