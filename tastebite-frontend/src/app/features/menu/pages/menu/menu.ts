import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Food, FoodService } from '../../../../core/services/food.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {

  private foodService = inject(FoodService);

  foods = signal<Food[]>([]);
  loading = signal(true);

  selectedCategory = 'All';

  categories = [
    'All',
    'Pizza',
    'Burger',
    'Pasta',
    'Dessert',
    'Drinks'
  ];

  ngOnInit(): void {

    console.log('Menu component initialized');

    this.loadFoods();

  }

  private loadFoods(): void {

    console.log('Loading all foods...');

    this.loading.set(true);

    this.foodService
      .getAllFoods()
      .pipe(
        finalize(() => {

          console.log('Food request finished');

          this.loading.set(false);

        })
      )
      .subscribe({

        next: (foods) => {

          console.log('Foods received:', foods);

          this.foods.set(foods);

        },

        error: (error) => {

          console.error('Failed to load foods:', error);

          this.foods.set([]);

        }

      });

  }


  selectCategory(category: string): void {

    console.log('Selected category:', category);

    this.selectedCategory = category;

    this.loading.set(true);


    if (category === 'All') {

      this.foodService
        .getAllFoods()
        .pipe(
          finalize(() => {

            this.loading.set(false);

          })
        )
        .subscribe({

          next: (foods) => {

            console.log('All foods received:', foods);

            this.foods.set(foods);

          },

          error: (error) => {

            console.error('Failed to load all foods:', error);

            this.foods.set([]);

          }

        });

      return;
    }


    this.foodService
      .getFoodsByCategory(category)
      .pipe(
        finalize(() => {

          this.loading.set(false);

        })
      )
      .subscribe({

        next: (foods) => {

          console.log(
            `${category} foods received:`,
            foods
          );

          this.foods.set(foods);

        },

        error: (error) => {

          console.error(
            `Failed to load ${category}:`,
            error
          );

          this.foods.set([]);

        }

      });

  }

  getImageUrl(image: string | null | undefined): string {
  return this.foodService.getImageUrl(image);
}

}