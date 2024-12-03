import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected readonly title = 'Hallo Welt';
}
