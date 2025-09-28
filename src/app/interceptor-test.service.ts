import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterceptorTestService {
  readonly #http = inject(HttpClient);

  /**
   * Test method that will trigger the filtering interceptor
   * This request will be intercepted and return filtered flights from the JSON file
   */
  testFlightRequest(
    from: string = 'Wien',
    to: string = 'Paris',
  ): Observable<any> {
    return this.#http.get('/api/flight', { params: { from, to } });
  }

  /**
   * Test different flight routes
   */
  testWienToLondon(): Observable<any> {
    return this.#http.get('/api/flight', {
      params: { from: 'Wien', to: 'London' },
    });
  }

  /**
   * Test flight route that should return no results
   */
  testNonExistentRoute(): Observable<any> {
    return this.#http.get('/api/flight', {
      params: { from: 'NonExistent', to: 'AlsoNonExistent' },
    });
  }

  /**
   * Test flight route with multiple results
   */
  testWienToMultipleDestinations(): Observable<any> {
    return this.#http.get('/api/flight', {
      params: { from: 'Wien', to: 'Berlin' },
    });
  }

  /**
   * Test Wien to Copenhagen (København) - should return 5 flights
   */
  testWienToCopenhagen(): Observable<any> {
    return this.#http.get('/api/flight', {
      params: { from: 'Wien', to: 'København' },
    });
  }

  /**
   * Test Copenhagen (København) to Wien - should return 5 flights
   */
  testCopenhagenToWien(): Observable<any> {
    return this.#http.get('/api/flight', {
      params: { from: 'København', to: 'Wien' },
    });
  }
}
