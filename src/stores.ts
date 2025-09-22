import {withDevtools} from "@angular-architects/ngrx-toolkit";
import {signalStore, withState} from "@ngrx/signals";

export const UserStore = signalStore(
  {providedIn: 'root'},
  withDevtools('user'),
  withState({id: 1, name: 'Emil der Elch'})
)

export const Page2Store = signalStore(withDevtools('page2'), withState({
  title: 'Page 2',
  content: 'Nothing to see here'
}))
