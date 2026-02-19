import { Routes } from '@angular/router';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { HomePage } from './home-page';
import { FlightEditFormComponent } from './flight-edit-form.component';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'flight-search', component: FlightSearchComponent },
  { path: 'flight-edit/:id', component: FlightEditFormComponent },
  { path: '**', redirectTo: '' },
];
