import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { FlightStore } from './flight-store';
import { computed, effect, inject, untracked } from '@angular/core';
import {
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

// Patient nested
// Patient class
// Patient change of 1 patient with  computed
// More stores with synchronization
// Input Constraints
// signalMethod
// withEntities

export interface Patient {
  id: number;
  address: {
    country: {
      isoCode: string;
      name: string;
    };
    plz: string;
  };
}

const patient: Patient = {
  id: 1,
  address: {
    country: {
      isoCode: 'DE',
      name: 'Germany',
    },
    plz: '12345',
  },
};

export const PatientStore = signalStore(
  withEntities<Patient>(),
  withComputed((state) => ({
    patients: computed(() => state.entities()),
  })),
  withMethods((store) => {
    const httpClient = inject(HttpClient);
    return {
      async load() {
        const patients = await lastValueFrom(httpClient.get<Patient[]>(''));
        patchState(store, setAllEntities(patients));
      },
    };
  })
);
