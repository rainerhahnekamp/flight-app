import { provideHttpClient } from '@angular/common/http';
import {
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { NextFlightsModule } from '@demo/ticketing/feature-next-flights';
import { LogLevel, provideLogger, withColor } from '@demo/shared/util-logger';
import { provideState, provideStore } from '@ngrx/store';
import { searchFeature } from '@demo/ticketing/data/+state/search-reducer';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { SearchEffects } from '@demo/ticketing/data/+state/search-effect';
import { FlightService } from '@demo/ticketing/data';
import { FlightStore } from '@demo/ticketing/data/flight-store';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES),
    importProvidersFrom(NextFlightsModule),
    importProvidersFrom(MatDialogModule),

    provideLogger(
      {
        level: LogLevel.DEBUG,
      },
      withColor()
    ),
    provideStore(),
    provideEffects([SearchEffects]),
    provideState(searchFeature),
    provideStoreDevtools(),
  ],
});
