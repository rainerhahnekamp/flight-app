import {Injectable} from "@angular/core";

interface Passenger {
  id: string;
  name: string;
}

const initPassenger = {id: '1', name: 'Max'};

const initPassengers: Passenger[] = [
  {id: '1', name: 'Max'},
  {id: '2', name: 'Peter'},
];

@Injectable({providedIn: 'root'})
export class PassengerClient {
  find(id: string) {
    return initPassengers.find(p => p.id === id) ?? initPassenger
   }
}
