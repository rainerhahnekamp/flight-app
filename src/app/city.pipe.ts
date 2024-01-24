import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'city',
  standalone: true,
})
export class CityPipe implements PipeTransform {
  transform(value: string, format: 'short' | 'long' = 'short'): string {
    if (value === 'Wien') {
      if (format === 'short') {
        return 'VIE';
      }

      return 'Schwechat';
    }

    return value;
  }
}
