import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AboutComponent } from './shell/about/about.component';
import { HomeComponent } from './shell/home/home.component';
import { BasketComponent } from './shell/basket/basket.component';
import { ConfigService } from '@demo/shared/util-config';
import { NotFoundComponent } from './shell/not-found/not-found.component';
import { FeatureManageComponent } from '@demo/checkin/feature-manage/feature-manage.component';
import { FlightService } from '@demo/ticketing/data';
import { catchError, from, of, retry } from 'rxjs';

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
    path: 'basket',
    component: BasketComponent,
    outlet: 'aux',
  },
  {
    path: '',
    resolve: {
      config: () => inject(ConfigService).loaded$,
    },
    children: [
      {
        path: 'luggage',
        loadChildren: () =>
          import('./domains/luggage/feature-checkin').then(
            (m) => m.FEATURE_CHECKIN_ROUTES
          ),
      },
      {
        path: 'checkin',
        component: FeatureManageComponent,
      },
      {
        path: 'flight-booking',
        canActivate: [
          () => {
            const flightService = inject(FlightService);
            const router = inject(Router);
            const home = router.createUrlTree(['/about']);
            return flightService.preloadAirports().pipe(
              retry(2),
              catchError(() => of(home))
            );
          },
        ],
        loadChildren: () =>
          import('@demo/ticketing/feature-booking').then(
            (m) => m.FLIGHT_BOOKING_ROUTES
          ),
      },
      {
        path: 'next-flights',
        loadChildren: () =>
          import('@demo/ticketing/feature-next-flights').then(
            (m) => m.NextFlightsModule
          ),
      },
      {
        path: 'about',
        component: AboutComponent,
      },

      // This _needs_ to be the last route!!
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];
