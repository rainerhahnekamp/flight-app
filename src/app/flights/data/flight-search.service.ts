import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from '../model/flight';
import { CachedFlightSearchService } from './cached-flight-search.service';

@Injectable({ providedIn: 'root', useClass: CachedFlightSearchService })
export abstract class FlightSearchService {
  abstract search(from: string, to: string): Observable<Array<Flight>>;

  abstract save(flight: Flight): Observable<void>;
}
