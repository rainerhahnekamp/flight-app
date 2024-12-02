export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  delayed: boolean;
}

const flight: Flight = {
  id: 1,
  from: 'SFO',
  to: 'JFK',
  date: '2022-01-01',
  delayed: false,
};

Object.freeze(flight);

type Color = 'red' | 'green' | 'blue';

type ColorMap = Record<Color, string>;

function addFlight(flight: Readonly<Flight>) {}

const colorMap: ColorMap = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
};
