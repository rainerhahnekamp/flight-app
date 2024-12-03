import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FlightSearchComponent } from './flights/flight-search/flight-search.component';

@Component({
  imports: [SidebarComponent, NavbarComponent, FlightSearchComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected readonly title = 'Hallo Welt';
}
