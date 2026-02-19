import {Component, inject} from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {FlightSearchComponent} from "./flight-search/flight-search.component";
import {FlightStore} from "./flight-store";

@Component({
    imports: [SidebarComponent, FlightSearchComponent, NavbarComponent],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  flightStore = inject(FlightStore)
  title = 'Hello World!';

  protected resetSearch() {
    this.flightStore.setSearchParams('Bratislava', 'Vienna')
  }
}
