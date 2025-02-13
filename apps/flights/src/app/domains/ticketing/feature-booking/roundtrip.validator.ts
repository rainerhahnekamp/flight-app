import {
  AbstractControl,
  FormGroup,
  isFormGroup,
  ValidatorFn,
} from '@angular/forms';
import { z } from 'zod';
import { from } from 'rxjs';

const formSchema = z.object({
  from: z.string(),
  to: z.number(),
});

type FormValue = z.infer<typeof formSchema>;

export const validateFlights: ValidatorFn = (ac: AbstractControl) => {
  const { from, to } = formSchema.parse(ac.value);

  return from === 'Wien' && String(to) === 'Linz' ? { fligths: true } : null;
};
