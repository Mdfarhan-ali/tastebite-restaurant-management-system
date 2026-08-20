import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ReservationService } from '../../../../core/services/reservation.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './reservation.html'
})
export class Reservation {

  // --------------------------------------------------
  // Service
  // --------------------------------------------------

  private readonly reservationService = inject(ReservationService);


  // --------------------------------------------------
  // Form Fields
  // --------------------------------------------------

  reservationDate = '';

  reservationTime = '';

  guests = 2;

  specialRequest = '';


  // --------------------------------------------------
  // UI State
  // --------------------------------------------------

  submitting = signal<boolean>(false);


  // --------------------------------------------------
  // Submit Reservation
  // --------------------------------------------------

  submitReservation(): void {

    // Prevent duplicate submission
    if (this.submitting()) {
      return;
    }


    // Validate required fields
    if (
      !this.reservationDate ||
      !this.reservationTime ||
      this.guests < 1
    ) {

      alert('Please fill all required fields.');

      return;
    }


    // Start submitting
    this.submitting.set(true);


    // Call API
    this.reservationService
      .createReservation({
        reservationDate: this.reservationDate,
        reservationTime: this.reservationTime,
        guests: this.guests,
        specialRequest: this.specialRequest
      })
      .pipe(

        // Always stop submitting when request finishes
        // successfully OR with an error.
        finalize(() => {
          this.submitting.set(false);
        })

      )
      .subscribe({

        // ----------------------------------------------
        // Success
        // ----------------------------------------------

        next: (reservation) => {

          console.log(
            'Reservation created:',
            reservation
          );


          alert(
            `Reservation #${reservation.id} created successfully!`
          );


          // Reset form
          this.reservationDate = '';

          this.reservationTime = '';

          this.guests = 2;

          this.specialRequest = '';
        },


        // ----------------------------------------------
        // Error
        // ----------------------------------------------

        error: (error) => {

          console.error(
            'Reservation failed:',
            error
          );


          alert(
            error?.error?.message ||
            'Failed to create reservation. Please try again.'
          );
        }

      });
  }

}