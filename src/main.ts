import {provideHttpClient} from '@angular/common/http';
import {inject, provideAppInitializer, provideZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {Configuration} from "./app/config";

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideZonelessChangeDetection(), provideAppInitializer(() => {
    const config = inject(Configuration)
    return config.fetchConfiguration()
  })],
});
