import {Component, OnDestroy} from "@angular/core";
import {interval, Subscriber, Subscription} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-time',
  template: '<p>Uhrzeit: {{ time }}</p>'
})
export class TimeComponent {
  time = new Date().toLocaleTimeString();
  sub: Subscription[] = []

  constructor() {
    this.sub.push(interval(1000).pipe(takeUntilDestroyed()).subscribe(() => {
      return this.time = new Date().toLocaleTimeString();
    }))
  }
}
