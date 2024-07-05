import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { NextFlightsModule } from '@demo/ticketing/feature-next-flights';
import { LogLevel, provideLogger, withColor } from '@demo/shared/util-logger';
import { provideStore } from '@ngrx/store';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTES),
    provideStore(),
    importProvidersFrom(NextFlightsModule),
    importProvidersFrom(MatDialogModule),

    provideLogger(
      {
        level: LogLevel.DEBUG,
      },
      withColor()
    ),
  ],
});
