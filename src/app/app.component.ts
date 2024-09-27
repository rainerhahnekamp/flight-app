import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { ConfigService } from './shared/config.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, FlightSearchComponent, NgIf],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Hello World!';

  configService = inject(ConfigService);
  cfgIsLoaded: boolean = false;

  ngOnInit() {
    this.configService.loadConfig().subscribe(() => {
      this.cfgIsLoaded = true;
    });
  }
}
