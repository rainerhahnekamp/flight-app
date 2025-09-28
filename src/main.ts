import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AppComponent } from './app/app.component';
import { Configuration } from './app/config';
import { filteringInterceptor } from './app/filtering.interceptor';
import { HomePage } from './app/home-page';

void bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
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
