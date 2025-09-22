import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouterLink, RouterOutlet} from "@angular/router";
import {Component, inject} from "@angular/core";
import {Page2Store, UserStore} from "./stores";

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet
  ],
  template: `<h1>App</h1>
  <p>This app demonstrates two bugs we have with the devtools.</p>

  <ol>
    <li><p>The first bug is that we are triggering the change detection very often. Some asynchronous task seems to run
      wild here.</p>
      <p>Just open the Angular Profiler, click on record and you'll see it.</p></li>
    <li>
      <p>Open the Redux Devtools. You should just see the UserStore.</p>
      <p>Click on the link to Page2 and the Page2Store should show up.</p>
      <p>Click on Page1. The Page2Store gets destroyed because it is locally provided. Still the devtools keep showing
        it, but now with the
        data of the UserStore.</p>
      <p>Navigate back to Page2 and the Page2Store has the correct data.</p>
    </li>
  </ol>

  <u>
    <li><a routerLink="/page-1">Page 1</a></li>
    <li><a routerLink="/page-2">Page 2</a></li>
  </u>

  <div>
    <router-outlet/>
  </div>
  `
})
class App {
  userStore = inject(UserStore)
}

@Component({
  template: `<h2>Page 1</h2>`
})
class Page1 {

}


@Component({
  template: `<h2>Page 2</h2>`,
  providers: [Page2Store]
})
class Page2 {
  page2Store = inject(Page2Store)
}


bootstrapApplication(App, {
  providers: [
    provideRouter([{
      path: 'page-1', component: Page1
    }, {
      path: 'page-2', component: Page2
    }])
  ],
});
