import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'city',
})
export class CityPipe implements PipeTransform {
  transform(city: string, format: 'short' | 'long' = 'short'): string {
    switch (city) {
      case 'Wien':
        return format === 'long' ? 'Wien Schwechat' : 'VIE';
      case 'London':
        return format === 'long' ? 'London Heathrow' : 'LHR';
      default:
        return city;
    }
  }
}
