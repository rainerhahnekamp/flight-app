import { mount } from 'cypress/angular';
import { FlightSearchComponent } from '@demo/ticketing/feature-booking/flight-search/flight-search.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

it('should search for Stuttgart to Wien', () => {
  cy.intercept(
    'http://localhost:8080/flight?from=London&to=Paris&urgent=false',
    { body: [] }
  ).as('request');
  mount(FlightSearchComponent, {
    providers: [provideHttpClient(), provideRouter([])],
  });

  cy.wait('@request');

  cy.intercept(
    'http://localhost:8080/flight?from=Stuttgart&to=Wien&urgent=false',
    {
      body: [
        { id: 1, from: 'Stuttgart', to: 'Wien', date: '2024-01-18T19:00' },
      ],
    }
  ).as('request');

  cy.get('#from').clear().type('Stuttgart');
  cy.get('#to').clear().type('Wien');
  cy.get('p').should('contain.text', 'Flights Count: 1');
  cy.get('app-flight-card').should('have.length', 1);
});
