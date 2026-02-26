import { Pipe, PipeTransform } from '@angular/core';

type CityFormat = 'short' | 'long';

@Pipe({
  name: 'city',
})
export class CityPipe implements PipeTransform {
  transform(value: string, format: CityFormat = 'short'): string {
    if (value === 'London') {
      return format === 'short' ? 'LHR' : 'Heathrow';
    } else if (value === 'Paris') {
      return format === 'short' ? 'CDG' : 'Charles de Gaulle';
    } else if (value === 'Düsseldorf') {
      return format === 'short' ? 'DUS' : 'Düsseldorf Airport';
    } else if (value === 'Wien') {
      return format === 'short' ? 'VIE' : 'Schwechat';
    }

    return value;
  }
}
