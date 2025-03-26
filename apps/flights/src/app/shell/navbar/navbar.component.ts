import { Component, inject } from '@angular/core';
import { TriggerService } from '../../trigger.service';

@Component({
  standalone: true,
  selector: 'app-navbar-cmp',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent {
  sidebarVisible = false;
  triggerService = inject(TriggerService);

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

  handleClick() {
    this.triggerService.trigger();
  }
}
