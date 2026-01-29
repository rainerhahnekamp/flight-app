import {Component} from '@angular/core';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {FlightSearchComponent} from "./flight-search/flight-search.component";
import {FormsModule} from "@angular/forms";
import {RouterOutlet} from "@angular/router";

@Component({
  imports: [SidebarComponent, NavbarComponent, FlightSearchComponent, FormsModule, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hello';

  setTitle(title: unknown) {
    console.log(title);
    this.title = String(title);
  }
}
