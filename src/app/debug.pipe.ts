import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'debug',
  standalone: true,
})
export class DebugPipe implements PipeTransform {
  transform(value: Record<string, unknown>): string {
    let output = [];

    for (const propertyName in value) {
      const propertyValue = String(value[propertyName]);
      output.push(`${propertyName} = '${propertyValue}'`);
    }

    return `{${output.join(', ')}`;
  }
}
