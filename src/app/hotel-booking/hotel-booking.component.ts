import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

interface Hotel {
  id: number;
  name: string;
  city: string;
  pricePerNight: number;
  available: boolean;
}

@Component({
  selector: 'app-hotel-booking',
  imports: [FormsModule, JsonPipe],
  templateUrl: './hotel-booking.component.html',
  styles: `
    .hotel-card {
      border: 1px solid #ddd;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 8px;
    }

    .hotel-card.selected {
      background-color: #e8f4f8;
      border-color: #0066cc;
    }

    .unavailable {
      opacity: 0.6;
      background-color: #f5f5f5;
    }
  `,
})
export class HotelBookingComponent {
  protected readonly hotels = signal<Hotel[]>([
    { id: 1, name: 'Hotel Sacher', city: 'Wien', pricePerNight: 250, available: true },
    { id: 2, name: 'Grand Hotel', city: 'Wien', pricePerNight: 180, available: true },
    { id: 3, name: 'Hotel Bristol', city: 'London', pricePerNight: 220, available: true },
    { id: 4, name: 'City Hotel', city: 'London', pricePerNight: 150, available: false },
    { id: 5, name: 'Hotel Imperial', city: 'Wien', pricePerNight: 300, available: true },
  ]);

  protected readonly selectedHotel = signal<Hotel | null>(null);
  protected city = '';
  protected filteredHotels = signal<Hotel[]>([]);

  constructor() {
    this.filteredHotels.set(this.hotels());
  }

  search() {
    if (!this.city) {
      this.filteredHotels.set(this.hotels());
    } else {
      const filtered = this.hotels().filter(
        hotel => hotel.city.toLowerCase().includes(this.city.toLowerCase())
      );
      this.filteredHotels.set(filtered);
    }
  }

  selectHotel(hotel: Hotel) {
    if (hotel.available) {
      this.selectedHotel.set(hotel);
    }
  }

  book() {
    const hotel = this.selectedHotel();
    if (hotel) {
      alert(`Hotel ${hotel.name} in ${hotel.city} wurde gebucht!`);
      this.selectedHotel.set(null);
    }
  }
}
