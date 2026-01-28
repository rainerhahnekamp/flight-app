import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideHttpClient} from "@angular/common/http";
import {inject, LOCALE_ID, provideAppInitializer} from "@angular/core";
import {Configuration} from "./app/configuration";

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(),
    provideAppInitializer(() => {
      return inject(Configuration).init()
    })],
});
