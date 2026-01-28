import {Pipe, PipeTransform} from "@angular/core";

type AirportFormat = 'short' | 'long'

@Pipe({
  name: 'airport'
})
export class AirportPipePipe implements PipeTransform {
  transform(value: string, format: AirportFormat = 'short'): string {
    if (value === 'Wien') {
      return format === 'short' ? 'VIE' : 'Schwechat';
    } else if (value === 'Linz') {
      return format === 'short' ? 'LNZ' : "Hörsching"
    }

    return value
  }

}
