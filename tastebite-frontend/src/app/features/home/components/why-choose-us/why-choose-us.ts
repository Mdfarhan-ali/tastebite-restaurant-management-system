import { Component } from '@angular/core';
import { Container } from '../../../../shared/components/container/container';
import { FeatureCard } from '../../../../shared/components/feature-card/feature-card';

@Component({
  selector: 'app-why-choose-us',
  imports: [
    Container,
    FeatureCard
  ],
  templateUrl: './why-choose-us.html',
  styleUrl: './why-choose-us.css'
})
export class WhyChooseUs {

  features = [
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Quick and reliable food delivery at your doorstep.'
    },
    {
      icon: '👨‍🍳',
      title: 'Expert Chefs',
      description: 'Delicious Meals, Expertly Crafted.'
    },
    {
      icon: '🥗',
      title: 'Fresh Ingredients',
      description: 'Only fresh and premium quality ingredients are used.'
    },
    {
      icon: '⭐',
      title: '5-Star Service',
      description: 'Thousands of happy customers trust TasteBite.'
    }
  ];

}