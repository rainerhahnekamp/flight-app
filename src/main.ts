import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  DefaultFlightService,
  DummyFlightService,
  FlightService,
} from './app/flight.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    {
      provide: FlightService,
      useFactory: () => new DefaultFlightService(),
    },
  ],
});
