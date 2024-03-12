import { inject } from '@angular/core';
import { CanActivateFn, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ConfigService } from './shared/config.service';
import { ErrorComponent } from './error.component';
import { delay, of } from 'rxjs';

const canActivate: CanActivateFn = (route, state) => {
  return of(true).pipe(delay(1000));
};

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: '',
    resolve: {
      config: () => inject(ConfigService).loaded$,
    },
    children: [
      {
        canActivate: [canActivate],
        path: 'flight-booking',
        loadChildren: () => import('./flight-booking/flight-booking.routes'),
      },
      {
        path: 'next-flights',
        loadChildren: () =>
          import('./next-flights/next-flights.module').then(
            (m) => m.NextFlightsModule
          ),
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      { path: 'error', component: ErrorComponent },

      // This _needs_ to be the last route!!
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];
