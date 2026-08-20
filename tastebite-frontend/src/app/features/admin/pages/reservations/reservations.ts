import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { finalize } from 'rxjs/operators';

import {
  Reservation,
  ReservationService
} from '../../../../core/services/reservation.service';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [],
  templateUrl: './reservations.html'
})
export class Reservations implements OnInit {

  // --------------------------------------------------
  // Service
  // --------------------------------------------------

  private readonly reservationService = inject(
    ReservationService
  );


  // --------------------------------------------------
  // Signals
  // --------------------------------------------------

  reservations = signal<Reservation[]>([]);

  loading = signal<boolean>(true);


  // --------------------------------------------------
  // Reservation Statuses
  // --------------------------------------------------

  statuses = [
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED'
  ];


  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------

  ngOnInit(): void {

    this.loadReservations();

  }


  // --------------------------------------------------
  // Load Reservations
  // --------------------------------------------------

  loadReservations(): void {

    console.log(
      'Loading admin reservations...'
    );

    this.loading.set(true);


    this.reservationService
      .getAllReservations()
      .pipe(

        // Always stop loading when the API
        // request completes or fails.
        finalize(() => {

          console.log(
            'Finished loading reservations.'
          );

          this.loading.set(false);

        })

      )
      .subscribe({

        // --------------------------------------------
        // Success
        // --------------------------------------------

        next: (reservations) => {

          console.log(
            'Reservations received:',
            reservations
          );

          this.reservations.set(
            reservations ?? []
          );

        },


        // --------------------------------------------
        // Error
        // --------------------------------------------

        error: (error) => {

          console.error(
            'Failed to load reservations:',
            error
          );

          this.reservations.set([]);

        }

      });

  }


  // --------------------------------------------------
  // Update Reservation Status
  // --------------------------------------------------

  updateStatus(
    id: number,
    status: string
  ): void {

    console.log(
      'Updating reservation status:',
      id,
      status
    );


    this.reservationService
      .updateReservationStatus(
        id,
        status
      )
      .subscribe({

        // --------------------------------------------
        // Success
        // --------------------------------------------

        next: (updated) => {

          console.log(
            'Reservation updated:',
            updated
          );


          this.reservations.update(
            (currentReservations) => {

              return currentReservations.map(
                (reservation) =>
                  reservation.id === id
                    ? updated
                    : reservation
              );

            }
          );

        },


        // --------------------------------------------
        // Error
        // --------------------------------------------

        error: (error) => {

          console.error(
            'Failed to update reservation:',
            error
          );

          alert(
            'Failed to update reservation status.'
          );

        }

      });

  }

}