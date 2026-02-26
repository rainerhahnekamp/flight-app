import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ConfigClient } from './app/config-client.service';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideAppInitializer(() => {
      const config = inject(ConfigClient);
      return config.load();
    }),
    provideRouter(appRoutes, withComponentInputBinding()),
  ],
});
