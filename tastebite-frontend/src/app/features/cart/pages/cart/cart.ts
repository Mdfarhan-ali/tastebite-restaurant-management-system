import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../../core/services/cart.service';
import { FoodService } from '../../../../core/services/food.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html'
})
export class Cart {

  cartService = inject(CartService);

  private foodService = inject(FoodService);


  // ==================================================
  // FOOD IMAGE URL
  // ==================================================

  getImageUrl(image: string | null | undefined): string {

    return this.foodService.getImageUrl(image);

  }


  // ==================================================
  // INCREASE QUANTITY
  // ==================================================

  increase(
    foodId: number,
    quantity: number
  ): void {

    this.cartService.updateQuantity(
      foodId,
      quantity + 1
    );

  }


  // ==================================================
  // DECREASE QUANTITY
  // ==================================================

  decrease(
    foodId: number,
    quantity: number
  ): void {

    this.cartService.updateQuantity(
      foodId,
      quantity - 1
    );

  }


  // ==================================================
  // REMOVE ITEM
  // ==================================================

  remove(foodId: number): void {

    this.cartService.removeFromCart(foodId);

  }

}