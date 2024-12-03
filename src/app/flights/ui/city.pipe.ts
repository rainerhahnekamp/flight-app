import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'city',
})
export class CityPipe implements PipeTransform {
  transform(city: string, defaultValue = '-'): string {
    switch (city) {
      case 'London':
        return 'LHR';
      case 'Paris':
        return 'CDG';
      case 'Wien':
        return 'VIE';
      case 'Düsseldorf':
        return 'DUS';
      default:
        return defaultValue;
    }
  }
}
