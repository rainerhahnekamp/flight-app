import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, firstValueFrom, of } from 'rxjs';
import { Flight } from './model/flight';
import { flights } from '../assets/filter-config.json';

export const filteringInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (!req.url.includes('/flight')) {
    return next(req);
  }

  console.info('intercepting flight request', req.url);

  const id = Number(req.url.match(/flight\/([0-9]+)/)?.[1]);
  if (id) {
    const flight = flights.find((flight) => flight.id === id);
    return of(
      new HttpResponse({
        body: flight,
      }),
    ).pipe(delay(200));
  }

  const from = req.params.get('from') || '';
  const to = req.params.get('to') || '';

  const filteredFlights = flights.filter(
    (flight) =>
      flight.from.toLowerCase().startsWith(from.toLowerCase()) &&
      flight.to.toLowerCase().startsWith(to.toLowerCase()),
  );

  return of(
    new HttpResponse({
      status: 200,
      body: filteredFlights,
    }),
  ).pipe(delay(200));
};
