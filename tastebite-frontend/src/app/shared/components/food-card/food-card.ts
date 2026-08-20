import { Component, input } from '@angular/core';
import { Food } from '../../interfaces/food.interface';
import { Button } from '../button/button';

@Component({
  selector: 'app-food-card',
  imports: [Button],
  templateUrl: './food-card.html',
  styleUrl: './food-card.css',
})
export class FoodCard {
  food = input.required<Food>();
}