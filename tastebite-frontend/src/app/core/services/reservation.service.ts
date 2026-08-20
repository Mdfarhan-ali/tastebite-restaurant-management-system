import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Reservation {
  id: number;
  userId: number;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  status: string;
  specialRequest: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/reservations`;

  createReservation(
    reservation: {
      reservationDate: string;
      reservationTime: string;
      guests: number;
      specialRequest: string;
    }
  ): Observable<Reservation> {

    return this.http.post<Reservation>(
      this.apiUrl,
      reservation
    );
  }

  getMyReservations(): Observable<Reservation[]> {

    return this.http.get<Reservation[]>(
      this.apiUrl
    );
  }

  getAllReservations(): Observable<Reservation[]> {

    return this.http.get<Reservation[]>(
      `${this.apiUrl}/admin`
    );
  }

  updateReservationStatus(
    id: number,
    status: string
  ): Observable<Reservation> {

    return this.http.patch<Reservation>(
      `${this.apiUrl}/admin/${id}/status`,
      {},
      {
        params: {
          status
        }
      }
    );
  }
}