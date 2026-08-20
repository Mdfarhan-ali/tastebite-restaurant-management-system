import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  Order,
  OrderService
} from '../../../../core/services/order.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './order-details.html'
})
export class OrderDetails implements OnInit {

  // --------------------------------------------------
  // Services
  // --------------------------------------------------

  private readonly route = inject(ActivatedRoute);

  private readonly orderService = inject(OrderService);


  // --------------------------------------------------
  // State
  // --------------------------------------------------

  order = signal<Order | null>(null);

  loading = signal<boolean>(true);


  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------

  ngOnInit(): void {

    this.loadOrder();

  }


  // --------------------------------------------------
  // Load Order
  // --------------------------------------------------

  private loadOrder(): void {

    this.loading.set(true);


    const idParam = this.route.snapshot.paramMap.get('id');

    const id = Number(idParam);


    // Validate ID
    if (!idParam || Number.isNaN(id) || id <= 0) {

      console.error(
        'Invalid order ID:',
        idParam
      );

      this.order.set(null);

      this.loading.set(false);

      return;
    }


    console.log(
      'Loading order:',
      id
    );


    this.orderService
      .getOrder(id)
      .subscribe({

        // --------------------------------------------
        // Success
        // --------------------------------------------

        next: (order) => {

          console.log(
            'Order received:',
            order
          );

          this.order.set(order);

          this.loading.set(false);

        },


        // --------------------------------------------
        // Error
        // --------------------------------------------

        error: (error) => {

          console.error(
            'Failed to load order:',
            error
          );

          this.order.set(null);

          this.loading.set(false);

        }

      });

  }

}