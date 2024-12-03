import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from './environments/environment';
import {
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { FlightSearchService } from './app/flights/data/flight-search.service';
import { CachedFlightSearchService } from './app/flights/data/cached-flight-search.service';
import { DefaultFlightService } from './app/flights/data/default-flight-service';

registerLocaleData(de, 'de');

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    {
      provide: LOCALE_ID,
      useValue: 'de',
    },
    { provide: DEFAULT_CURRENCY_CODE, useValue: '€' },
    {
      provide: FlightSearchService,
      useFactory: () => {
        return environment.useCachedFlightService
          ? new CachedFlightSearchService()
          : new DefaultFlightService();
      },
    },
  ],
});
