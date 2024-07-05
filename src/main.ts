import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { NextFlightsModule } from './app/next-flights/next-flights.module';
import { withColor } from './app/shared/logger/color';
import { provideLogger } from './app/shared/logger/provider';
import {
  createActionGroup,
  createReducer,
  on,
  props,
  provideStore,
} from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { Flight } from './app/model/flight';
import { provideEffects } from '@ngrx/effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    importProvidersFrom(NextFlightsModule),
    importProvidersFrom(MatDialogModule),
    provideStore(),
    provideEffects([]),
    provideStoreDevtools(),
    provideLogger({}, withColor()),
  ],
});
