import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FoodService } from '../../../../core/services/food.service';
import { OrderService } from '../../../../core/services/order.service';
import { ReservationService } from '../../../../core/services/reservation.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html'
})
export class AdminDashboard implements OnInit {

  private foodService = inject(FoodService);
  private orderService = inject(OrderService);
  private reservationService = inject(ReservationService);

  // ======================================================
  // DASHBOARD SIGNALS
  // ======================================================

  totalFoods = signal(0);
  totalOrders = signal(0);
  totalReservations = signal(0);
  totalRevenue = signal(0);

  loading = signal(true);

  // ======================================================
  // INIT
  // ======================================================

  ngOnInit(): void {
    this.loadDashboard();
  }

  // ======================================================
  // LOAD DASHBOARD
  // ======================================================

  private loadDashboard(): void {

    this.loading.set(true);

    forkJoin({
      foods: this.foodService.getAllFoods(),
      orders: this.orderService.getAllOrders(),
      reservations: this.reservationService.getAllReservations()
    })
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({

        next: ({ foods, orders, reservations }) => {

          console.log('ADMIN DASHBOARD DATA');

          console.log('Foods:', foods);
          console.log('Orders:', orders);
          console.log('Reservations:', reservations);

          // ==================================================
          // UPDATE FOOD COUNT
          // ==================================================

          this.totalFoods.set(
            Array.isArray(foods) ? foods.length : 0
          );

          // ==================================================
          // UPDATE ORDER COUNT
          // ==================================================

          this.totalOrders.set(
            Array.isArray(orders) ? orders.length : 0
          );

          // ==================================================
          // UPDATE RESERVATION COUNT
          // ==================================================

          this.totalReservations.set(
            Array.isArray(reservations) ? reservations.length : 0
          );

          // ==================================================
          // CALCULATE REVENUE
          // ==================================================

          const revenue = Array.isArray(orders)
            ? orders.reduce(
                (total, order) =>
                  total + Number(order?.totalAmount || 0),
                0
              )
            : 0;

          this.totalRevenue.set(revenue);

          console.log('Total Foods:', this.totalFoods());
          console.log('Total Orders:', this.totalOrders());
          console.log(
            'Total Reservations:',
            this.totalReservations()
          );
          console.log('Total Revenue:', this.totalRevenue());
        },

        error: (error) => {

          console.error(
            'ADMIN DASHBOARD API ERROR:',
            error
          );

          console.error(
            'Status:',
            error?.status
          );

          console.error(
            'URL:',
            error?.url
          );

          console.error(
            'Message:',
            error?.message
          );

          // Reset dashboard values on error
          this.totalFoods.set(0);
          this.totalOrders.set(0);
          this.totalReservations.set(0);
          this.totalRevenue.set(0);

        }

      });
  }
}