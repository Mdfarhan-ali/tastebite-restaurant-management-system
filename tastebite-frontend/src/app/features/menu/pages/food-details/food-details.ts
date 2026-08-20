import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import {
  Food,
  FoodService
} from '../../../../core/services/food.service';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-food-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './food-details.html'
})
export class FoodDetails implements OnInit {

  private route = inject(ActivatedRoute);

  private foodService = inject(FoodService);

  private cartService = inject(CartService);


  // =========================
  // Signals
  // =========================

  food = signal<Food | null>(null);

  loading = signal(true);

  errorMessage = signal('');

  quantity = signal(1);


  // =========================
  // Initialize
  // =========================

  ngOnInit(): void {

    console.log('Food Details component initialized');

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log('Food ID:', id);


    // Invalid ID

    if (!id || Number.isNaN(id)) {

      console.error('Invalid food ID');

      this.errorMessage.set(
        'Invalid food ID.'
      );

      this.loading.set(false);

      return;
    }


    this.loadFood(id);

  }


  // =========================
  // Load Food
  // =========================

  private loadFood(id: number): void {

    console.log('Loading food:', id);

    this.loading.set(true);

    this.errorMessage.set('');

    this.foodService
      .getFoodById(id)
      .pipe(

        finalize(() => {

          console.log(
            'Food request finished'
          );

          this.loading.set(false);

        })

      )
      .subscribe({

        next: (food) => {

          console.log(
            'Food received:',
            food
          );

          this.food.set(food);

        },

        error: (error) => {

          console.error(
            'Failed to load food:',
            error
          );

          this.food.set(null);

          this.errorMessage.set(
            'Unable to load this food item.'
          );

        }

      });

  }


  // =========================
  // Quantity
  // =========================

  increaseQuantity(): void {

    this.quantity.update(
      value => value + 1
    );

  }


  decreaseQuantity(): void {

    this.quantity.update(
      value => value > 1
        ? value - 1
        : value
    );

  }


  // =========================
  // Add To Cart
  // =========================

  addToCart(): void {

    const currentFood = this.food();

    if (!currentFood) {
      return;
    }

    this.cartService.addToCart(
      currentFood,
      this.quantity()
    );

    alert(
      `${currentFood.name} added to cart`
    );


  }
  getImageUrl(image: string | null | undefined): string {
    return this.foodService.getImageUrl(image);
  }

}