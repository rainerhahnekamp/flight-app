import {Pipe, PipeTransform} from "@angular/core";


function printSomething(value: unknown) {
  if (typeof value === 'string') {
    value.toUpperCase();
  }

  if (value instanceof Date) {
    value.getTime();
  }
}

type CityFormat = 'short' | 'long';

@Pipe({name: 'city'})
export class CityPipe implements PipeTransform {
  transform(value: string, format: CityFormat = 'short'): string {

    if (value === 'London') {
      return format === 'short' ? 'LHR' : 'London Heathrow'
    } else if (value === 'Paris') {
      return format === 'short' ? 'CDG' : 'Charles de Gaulle'
    } else if (value === 'Bratislava') {
      return format === 'short' ? 'BTS' : 'Bratislava International Airport'
    }

    return value;
  }
}

@Pipe({name: 'myDate'})
export class MyDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }
}
