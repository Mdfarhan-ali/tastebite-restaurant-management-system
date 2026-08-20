import { Component } from '@angular/core';
import { Container } from '../../../../shared/components/container/container';
import { FoodCard } from '../../../../shared/components/food-card/food-card';
import { POPULAR_DISHES } from '../../data/home.data';

@Component({
  selector: 'app-popular-dishes',
  imports: [
    Container,
    FoodCard
  ],
  templateUrl: './popular-dishes.html',
  styleUrl: './popular-dishes.css'
})
export class PopularDishes {

  dishes = POPULAR_DISHES;

}