import {AbstractControl, ValidatorFn} from "@angular/forms";
import {from} from "rxjs";

export const validateRoundtrip: ValidatorFn = (ac: AbstractControl) => {
  const {from, to} = ac.value;

  return from === to ? {roundtrip: from} : null;

}
