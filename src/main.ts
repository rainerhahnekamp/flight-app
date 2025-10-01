import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { Configuration } from './app/config';
import { FlightStore } from './app/flight-store.service';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HomePage } from './app/home-page';
import { filteringInterceptor } from './app/filtering.interceptor';

void bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(
      [
        {
          path: '',
          component: HomePage,
        },
        {
          path: 'flights',
          children: [
            {
              path: 'search',
              loadComponent: () => import('./app/flight-search-page'),
            },
          ],
        },
      ],
      withComponentInputBinding(),
    ),
    provideAppInitializer(() => {
      const config = inject(Configuration);
      return config.fetchConfiguration();
    }),
  ],
});
