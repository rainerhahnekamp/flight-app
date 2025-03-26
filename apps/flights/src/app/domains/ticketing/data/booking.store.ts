import { Flight } from './flight';
import { signalStore, withComputed, withState } from '@ngrx/signals';
import { withLocalStorageSync } from '../local-storage-sync';
import { withFavourites } from '../with-favourites';
import { computed } from '@angular/core';

type Booking = {
  id: number;
  startDate: string;
  endDate: string;
  roomNr: string;
};

const BookingStore = signalStore(
  withState({ bookings: [] as Booking[] }),
  withLocalStorageSync('booking'),
  withComputed((state) => ({
    entities: computed(() => state.bookings()),
  })),
  withFavourites()
);

const bookingStore = new BookingStore();
