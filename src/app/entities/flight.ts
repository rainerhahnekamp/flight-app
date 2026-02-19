export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  delayed: boolean;
}

const flight: Flight = {
  id: 1,
  from: 'London',
  to: 'Paris',
  date: '2025-01-01',
  delayed: false
}

class FlightEntity {
  constructor(public id: number, public from: string, public to: string,
              public date: string, public delayed: boolean) {
  }
}

const flightEntity = new FlightEntity(1, 'London', 'Paris', '2025-01-01', false);


function printFlight(flight: Flight) {
  console.log(flight.id + ' ' + flight.from + ' ' + flight.to + ' ' + flight.date + ' ' + flight.delayed);
}

printFlight(flight);
