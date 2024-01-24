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
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom([FormlyModule.forRoot(), FormlyMaterialModule]),
    {
      provide: FlightService,
      useFactory: () => new DefaultFlightService(),
    },
  ],
});
