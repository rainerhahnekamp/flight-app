import { provideHttpClient } from '@angular/common/http';
import {
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { Configuration } from './app/config';
import { FlightClient } from './app/flight-client';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';

void bootstrapApplication(AppComponent, {
  providers: [
    provideFormlyCore(withFormlyMaterial()),
    provideHttpClient(),
    provideZonelessChangeDetection(),
    provideAppInitializer(() => {
      const config = inject(Configuration);
      return config.fetchConfiguration();
    }),
  ],
});
