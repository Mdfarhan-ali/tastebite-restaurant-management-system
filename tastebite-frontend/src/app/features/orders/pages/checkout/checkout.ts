import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../../../core/services/cart.service';
import { OrderService } from '../../../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, RouterLink],
  templateUrl: './checkout.html'
})
export class Checkout {

  cartService = inject(CartService);

  private orderService = inject(OrderService);
  private router = inject(Router);

  deliveryAddress = '';

  placingOrder = false;

  placeOrder(): void {

    if (!this.deliveryAddress.trim()) {
      alert('Please enter your delivery address.');
      return;
    }

    if (this.cartService.items().length === 0) {
      alert('Your cart is empty.');
      return;
    }

    this.placingOrder = true;

    this.orderService
      .createOrder(
        this.cartService.subtotal(),
        this.deliveryAddress
      )
      .subscribe({

        next: (order) => {

          this.cartService.clearCart();

          alert(
            `Order #${order.id} placed successfully!`
          );

          this.router.navigate([
            '/orders'
          ]);

        },

        error: (error) => {

          console.error(
            'Order creation failed:',
            error
          );

          alert(
            'Failed to place order. Please try again.'
          );

          this.placingOrder = false;

        }

      });
  }
}