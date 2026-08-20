import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Reservation,
  ReservationService
} from '../../../../core/services/reservation.service';

@Component({
  selector: 'app-my-reservations',
  imports: [RouterLink],
  templateUrl: './my-reservations.html'
})
export class MyReservations implements OnInit {

  private reservationService = inject(ReservationService);

  reservations = signal<Reservation[]>([]);
  loading = signal(true);

  ngOnInit(): void {

    this.reservationService
      .getMyReservations()
      .subscribe({

        next: (reservations) => {
          this.reservations.set(reservations);
          this.loading.set(false);
        },

        error: (error) => {
          console.error(
            'Failed to load reservations:',
            error
          );

          this.loading.set(false);
        }

      });
  }
}