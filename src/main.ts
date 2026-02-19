import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
  InjectionToken,
  LOCALE_ID,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { Config } from './app/config';
import { routes } from './app/app.routes';
import { provideRouter, withComponentInputBinding } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(),
    provideAppInitializer(() => {
      return inject(Config).init();
    }),
    provideRouter(routes, withComponentInputBinding()),
  ],
});
