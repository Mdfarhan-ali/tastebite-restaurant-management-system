import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Order,
  OrderService
} from '../../../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './orders.html'
})
export class Orders implements OnInit {

  // --------------------------------------------------
  // Services
  // --------------------------------------------------

  private readonly orderService = inject(OrderService);


  // --------------------------------------------------
  // State
  // --------------------------------------------------

  loading = signal<boolean>(true);

  orders = signal<Order[]>([]);


  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------

  ngOnInit(): void {
    this.loadOrders();
  }


  // --------------------------------------------------
  // Load Orders
  // --------------------------------------------------

  private loadOrders(): void {

    this.loading.set(true);

    this.orderService
      .getMyOrders()
      .subscribe({

        next: (orders: Order[]) => {

          console.log('Orders received:', orders);

          this.orders.set(orders);

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Failed to load orders:',
            error
          );

          this.orders.set([]);

          this.loading.set(false);

        }

      });

  }

deleteOrder(order: Order): void {

  if (order.status !== 'DELIVERED') {
    return;
  }

  const confirmed = confirm(
    `Are you sure you want to delete Order #${order.id}?`
  );

  if (!confirmed) {
    return;
  }

  this.orderService
    .deleteOrder(order.id)
    .subscribe({

      next: () => {

        console.log(
          `Order #${order.id} deleted successfully`
        );

        this.orders.update(
          orders =>
            orders.filter(
              existingOrder =>
                existingOrder.id !== order.id
            )
        );

      },

      error: (error) => {

        console.error(
          'Failed to delete order:',
          error
        );

        alert(
          error?.error?.message ||
          'Unable to delete the order.'
        );

      }

    });
}

}