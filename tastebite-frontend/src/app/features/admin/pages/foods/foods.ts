import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { finalize } from 'rxjs/operators';

import {
  Food,
  FoodService
} from '../../../../core/services/food.service';

@Component({
  selector: 'app-admin-foods',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './foods.html'
})
export class Foods implements OnInit {

  // --------------------------------------------------
  // Service
  // --------------------------------------------------

  private readonly foodService = inject(
    FoodService
  );


  // --------------------------------------------------
  // Signals
  // --------------------------------------------------

  foods = signal<Food[]>([]);

  loading = signal<boolean>(true);

  searchTerm = signal<string>('');

  selectedCategory = signal<string>('All');


  // --------------------------------------------------
  // Categories
  // --------------------------------------------------

  categories = [
    'All',
    'Pizza',
    'Burger',
    'Pasta',
    'Dessert',
    'Drinks'
  ];


  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------

  ngOnInit(): void {

    this.loadFoods();

  }


  // --------------------------------------------------
  // Load Foods
  // --------------------------------------------------

  loadFoods(): void {

    console.log(
      'Loading foods...'
    );

    this.loading.set(true);


    this.foodService
      .getAllFoods()
      .pipe(

        finalize(() => {

          console.log(
            'Finished loading foods.'
          );

          this.loading.set(false);

        })

      )
      .subscribe({

        // --------------------------------------------
        // Success
        // --------------------------------------------

        next: (foods) => {

          console.log(
            'Foods received:',
            foods
          );

          this.foods.set(
            foods ?? []
          );

        },


        // --------------------------------------------
        // Error
        // --------------------------------------------

        error: (error) => {

          console.error(
            'Failed to load foods:',
            error
          );

          this.foods.set([]);

        }

      });

  }


  // --------------------------------------------------
  // Filtered Foods
  // --------------------------------------------------

  get filteredFoods(): Food[] {

    const foods = this.foods();

    const searchTerm =
      this.searchTerm()
        .trim()
        .toLowerCase();

    const selectedCategory =
      this.selectedCategory();


    return foods.filter(
      (food) => {

        const matchesSearch =
          food.name
            .toLowerCase()
            .includes(searchTerm);


        const matchesCategory =
          selectedCategory === 'All' ||
          food.category === selectedCategory;


        return (
          matchesSearch &&
          matchesCategory
        );

      }
    );

  }


  // --------------------------------------------------
  // Delete Food
  // --------------------------------------------------

  deleteFood(id: number): void {

    const confirmed = confirm(
      'Are you sure you want to delete this food?'
    );


    if (!confirmed) {

      return;

    }


    console.log(
      'Deleting food:',
      id
    );


    this.foodService
      .deleteFood(id)
      .subscribe({

        // --------------------------------------------
        // Success
        // --------------------------------------------

        next: () => {

          console.log(
            'Food deleted successfully:',
            id
          );

          this.loadFoods();

        },


        // --------------------------------------------
        // Error
        // --------------------------------------------

        error: (error) => {

          console.error(
            'Failed to delete food:',
            error
          );

          alert(
            'Failed to delete food.'
          );

        }

      });

  }


  // --------------------------------------------------
  // Get Food Image URL
  // --------------------------------------------------

  getImageUrl(
    image?: string | null
  ): string {

    return this.foodService.getImageUrl(
      image
    );

  }

}