import { provideHttpClient, withInterceptors } from '@angular/common/http';
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
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HomePage } from './app/home-page';
import { filteringInterceptor } from './app/filtering.interceptor';

void bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([filteringInterceptor])),
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
            {
              path: 'edit/:id',
              loadComponent: () =>
                import('./app/flight-edit-page/flight-edit-page'),
            },
          ],
        },
      ],
      withComponentInputBinding(),
    ),
    provideZonelessChangeDetection(),
    provideAppInitializer(() => {
      const config = inject(Configuration);
      return config.fetchConfiguration();
    }),
  ],
});
