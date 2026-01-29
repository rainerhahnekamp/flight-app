import {Component, computed, effect, inject, input} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  template: `Passagier mit der ID: {{ idNumber() }}`
})
export class PassengerPage {
  id = input.required<string>()
  router = inject(Router)

  idNumber = computed(() => Number(this.id()))

  constructor() {
    effect(() => {
       if(isNaN(this.idNumber())) {
         void this.router.navigate(['/not-found']);
       }
    })
  }


}
