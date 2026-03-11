import { Component, inject } from '@angular/core';

import { LoggerService } from '@demo/shared/util-logger';
import { AuthService } from '@demo/shared/util-auth';
import { ApaStore } from '@demo/ticketing/apa-store';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  logger = inject(LoggerService);
  auth = inject(AuthService);
  apaStore = inject(ApaStore);

  constructor() {
    this.logger.debug('home', 'debug');
    this.logger.info('home', 'info');
    this.logger.error('home', 'error');
  }
}
