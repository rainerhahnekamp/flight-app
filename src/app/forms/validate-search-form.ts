import { Signal, WritableSignal } from '@angular/core';
import { form, required, validate } from '@angular/forms/signals';

export function createForm(
  searchParams: WritableSignal<{ from: string; to: string }>,
) {
  return form(searchParams, (path) => {
    required(path.from, { message: 'Das Feld muss ausgefüllt sein' });
    required(path.to, { message: 'Das Feld muss ausgefüllt sein' });

    validate(path.from, (ctx) => {
      if (ctx.value() === 'Wien') {
        return undefined;
      }
      if (ctx.value() === ctx.valueOf(path.to)) {
        return {
          kind: 'roundtrip',
          message: 'Rundumflüge sind nicht erlaubt',
        };
      }

      return undefined;
    });
  });
}
