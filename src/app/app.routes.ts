import { FlightEdit } from './flight-edit';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { HomePageComponent } from './home-page';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'flight-search', component: FlightSearchComponent },
  { path: 'flight-edit/:id', component: FlightEdit },
];
