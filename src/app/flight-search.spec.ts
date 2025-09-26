import FlightSearchComponent from './flight-search/flight-search.component';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('Flight Search', () => {
  const setup = async (path = 'flight-search') => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          {
            path,
            component: FlightSearchComponent,
          },
        ]),
        provideLocationMocks(),
        provideHttpClientTesting(),
      ],
    });

    const harness = await RouterTestingHarness.create(path);

    return harness;
  };

  it('should search for Wien to Berlin', async () => {
    const harness = await setup();

    const ctrl = TestBed.inject(HttpTestingController);
    const input = document.querySelector(
      '[data-testid=inp-from]',
    ) as HTMLInputElement;

    expect(input.value).toBe('London');

    const button = document.querySelector(
      '[data-testid=btn-search]',
    ) as HTMLButtonElement;

    button.click();
    ctrl.expectOne('/flight?from=London&to=Paris').flush([
      {
        id: 1,
        from: 'London',
        to: 'Paris',
        date: '2025-09-24',
        delayed: false,
      },
      {
        id: 2,
        from: 'London',
        to: 'Paris',
        date: '2025-09-25',
        delayed: false,
      },
    ]);

    await harness.fixture.whenStable();

    const cards = document.querySelectorAll('[data-testid=flight-card]');
    expect(cards.length).toBe(2);
  });
});
