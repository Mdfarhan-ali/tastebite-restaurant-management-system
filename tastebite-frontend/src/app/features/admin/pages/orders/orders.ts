import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Order,
  OrderService
} from '../../../../core/services/order.service';

import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-admin-orders',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './orders.html'
})
export class AdminOrders implements OnInit {

  // ==================================================
  // SERVICE
  // ==================================================

  private readonly orderService =
    inject(OrderService);


  // ==================================================
  // STATE
  // ==================================================

  orders = signal<Order[]>([]);

  loading = signal<boolean>(true);

  updatingStatus = signal<number | null>(null);


  // ==================================================
  // FILTERS
  // ==================================================

  searchTerm = signal<string>('');

  selectedStatus = signal<string>('All');


  statuses = [
    'All',
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ];


  // ==================================================
  // LIFECYCLE
  // ==================================================

  ngOnInit(): void {

    this.loadOrders();

  }


  // ==================================================
  // LOAD ORDERS
  // ==================================================

  loadOrders(): void {

    console.log(
      'Loading admin orders...'
    );

    this.loading.set(true);


    this.orderService
      .getAllOrders()
      .pipe(

        finalize(() => {

          this.loading.set(false);

          console.log(
            'Finished loading orders.'
          );

        })

      )
      .subscribe({

        // --------------------------------------------
        // SUCCESS
        // --------------------------------------------

        next: (orders) => {

          console.log(
            'Orders received:',
            orders
          );

          this.orders.set(
            orders ?? []
          );

        },


        // --------------------------------------------
        // ERROR
        // --------------------------------------------

        error: (error) => {

          console.error(
            'Failed to load orders:',
            error
          );

          this.orders.set([]);

        }

      });

  }


  // ==================================================
  // FILTERED ORDERS
  // ==================================================

  get filteredOrders(): Order[] {

    const orders =
      this.orders();


    const searchTerm =
      this.searchTerm()
        .trim()
        .toLowerCase();


    const selectedStatus =
      this.selectedStatus();


    return orders.filter(
      (order) => {

        const matchesSearch =

          order.id
            .toString()
            .includes(searchTerm)

          ||

          order.userId
            .toString()
            .includes(searchTerm)

          ||

          order.deliveryAddress
            .toLowerCase()
            .includes(searchTerm);


        const matchesStatus =

          selectedStatus === 'All'

          ||

          order.status === selectedStatus;


        return (
          matchesSearch &&
          matchesStatus
        );

      }
    );

  }


  // ==================================================
  // UPDATE ORDER STATUS
  // ==================================================

  updateStatus(
    order: Order,
    status: string
  ): void {

    if (
      !status ||
      status === order.status
    ) {

      return;

    }


    console.log(
      'Updating order status:',
      order.id,
      status
    );


    this.updatingStatus.set(
      order.id
    );


    this.orderService
      .updateOrderStatus(
        order.id,
        status
      )
      .pipe(

        finalize(() => {

          this.updatingStatus.set(
            null
          );

        })

      )
      .subscribe({

        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

        next: (updatedOrder) => {

          console.log(
            'Order status updated:',
            updatedOrder
          );


          this.orders.update(
            (orders) =>

              orders.map(
                (currentOrder) =>

                  currentOrder.id === order.id

                    ? updatedOrder

                    : currentOrder

              )

          );

        },


        // ------------------------------------------
        // ERROR
        // ------------------------------------------

        error: (error) => {

          console.error(
            'Failed to update order status:',
            error
          );

          alert(
            error?.error?.message ||
            'Failed to update order status.'
          );

        }

      });

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

        return 'bg-green-50 text-green-700';


      case 'CANCELLED':

        return 'bg-red-50 text-red-700';


      default:

        return 'bg-gray-100 text-gray-700';

    }

  }


  // ==================================================
  // FORMAT DATE
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


  // ==================================================
  // FORMAT TIME
  // ==================================================

  formatTime(
    date: string
  ): string {

    if (!date) {

      return '-';

    }


    return new Date(
      date
    ).toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }

  

}