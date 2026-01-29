import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideHttpClient} from "@angular/common/http";
import {inject, provideAppInitializer, provideZoneChangeDetection} from "@angular/core";
import {Configuration} from "./app/configuration";
import {provideRouter, withComponentInputBinding} from "@angular/router";


bootstrapApplication(AppComponent, {
  providers: [
    provideAppInitializer(() => {
      return inject(Configuration).init()
    }), provideRouter([{
      path: '',
      loadComponent: () => import('./app/home-page').then(m => m.HomePage)
    }, {
      path: 'flight-search',
      loadComponent: () => import('./app/flight-search/flight-search.component').then(m => m.FlightSearchComponent)
    }, {
      path: 'hotels',
      loadComponent: () => import('./app/hotel-booking/hotel-booking.component').then(m => m.HotelBookingComponent)
    },
      {
        path: 'passenger/:id',
        loadComponent: () => import('./app/passenger-page').then(m => m.PassengerPage)
      }, {
        path: '**',
        loadComponent: () => import('./app/not-found-page').then(m => m.NotFoundPage)

      }], withComponentInputBinding())],

});
