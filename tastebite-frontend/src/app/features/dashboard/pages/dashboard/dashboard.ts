import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';

import {
  Order,
  OrderService
} from '../../../../core/services/order.service';

import {
  Reservation,
  ReservationService
} from '../../../../core/services/reservation.service';


@Component({
  selector: 'app-customer-dashboard',

  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {

  // ==================================================
  // SERVICES
  // ==================================================

  private readonly orderService =
    inject(OrderService);

  private readonly reservationService =
    inject(ReservationService);


  // ==================================================
  // USER
  // ==================================================

  userName = signal<string>('Customer');


  // ==================================================
  // ORDERS
  // ==================================================

  orders = signal<Order[]>([]);

  loadingOrders = signal<boolean>(true);


  // ==================================================
  // RESERVATIONS
  // ==================================================

  reservations = signal<Reservation[]>([]);

  loadingReservations = signal<boolean>(true);


  // ==================================================
  // LIFECYCLE
  // ==================================================

  ngOnInit(): void {

    this.loadUser();

    this.loadOrders();

    this.loadReservations();

  }


  // ==================================================
  // LOAD USER
  // ==================================================

  private loadUser(): void {

    const userJson =
      localStorage.getItem('user');


    if (!userJson) {

      return;

    }


    try {

      const user =
        JSON.parse(userJson);


      this.userName.set(
        user.name ||
        user.firstName ||
        user.username ||
        'Customer'
      );

    } catch (error) {

      console.error(
        'Failed to read user data:',
        error
      );

    }

  }


  // ==================================================
  // LOAD ORDERS
  // ==================================================

  private loadOrders(): void {

    this.loadingOrders.set(true);


    this.orderService
      .getMyOrders()
      .subscribe({

        next: (orders: Order[]) => {

          console.log(
            'Orders received:',
            orders
          );

          this.orders.set(
            orders ?? []
          );

          this.loadingOrders.set(false);

        },

        error: (error) => {

          console.error(
            'Failed to load orders:',
            error
          );

          this.orders.set([]);

          this.loadingOrders.set(false);

        }

      });

  }


  // ==================================================
  // LOAD RESERVATIONS
  // ==================================================

  private loadReservations(): void {

    this.loadingReservations.set(true);


    this.reservationService
      .getMyReservations()
      .subscribe({

        next: (
          reservations: Reservation[]
        ) => {

          console.log(
            'Reservations received:',
            reservations
          );

          this.reservations.set(
            reservations ?? []
          );

          this.loadingReservations.set(false);

        },

        error: (error) => {

          console.error(
            'Failed to load reservations:',
            error
          );

          this.reservations.set([]);

          this.loadingReservations.set(false);

        }

      });

  }


  // ==================================================
  // RECENT ORDERS
  // ==================================================

  get recentOrders(): Order[] {

    return this.orders().slice(
      0,
      3
    );

  }


  // ==================================================
  // UPCOMING RESERVATIONS
  // ==================================================

  get upcomingReservations(): Reservation[] {

    return this.reservations().slice(
      0,
      3
    );

  }


  // ==================================================
  // STATUS STYLE
  // ==================================================

  getStatusClass(
    status: string
  ): string {

    switch (
      status?.toUpperCase()
    ) {

      case 'PENDING':

        return 'bg-yellow-50 text-yellow-700';


      case 'CONFIRMED':

        return 'bg-blue-50 text-blue-700';


      case 'PREPARING':

        return 'bg-purple-50 text-purple-700';


      case 'OUT_FOR_DELIVERY':

        return 'bg-orange-50 text-orange-700';


      case 'DELIVERED':
      case 'COMPLETED':

        return 'bg-green-50 text-green-700';


      case 'CANCELLED':
      case 'REJECTED':

        return 'bg-red-50 text-red-700';


      default:

        return 'bg-gray-100 text-gray-700';

    }

  }


  // ==================================================
  // ORDER DATE
  // ==================================================

  formatDate(
    date: string
  ): string {

    if (!date) {

      return '-';

    }


    return new Date(
      date
    ).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }

}