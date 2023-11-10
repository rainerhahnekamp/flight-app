import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {FlightService} from "@demo/ticketing/data/flight.service";
import {computed, inject} from "@angular/core";
import {Flight} from "@demo/ticketing/data/flight";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {debounceTime, Observable, pipe, switchMap, tap} from "rxjs";

export const FlightStore = signalStore(
  {providedIn: 'root'},
  withState({from: 'Paris', to: "London", flights: [] as Flight[]}),

  withMethods((state) => {
    const flightService = inject(FlightService)

    return {
      liveSearch: rxMethod<{ from: string, to: string }>(pipe(
        debounceTime(100),
        switchMap(({from, to}) => flightService.find(from, to)),
        tap(flights => patchState(state, ({flights}))))),
      setFrom(from: string) {
        patchState(state, {from})
      },
      setTo(to: string) {
        patchState(state, {to})
      },
      async search() {
        const flights = await flightService.findPromise(state.from(), state.to())
        patchState(state, {flights});
      }
    }
  }),
  withComputed(state => ({
    from: state.from,
    to: state.to,
    flights: state.flights,
    params: computed(() => ({from: state.from(), to: state.to()}))
  })),
  withHooks({onInit: ({liveSearch, params}) => liveSearch(params)})
)
