import { Food } from '../../../shared/interfaces/food.interface';

export const POPULAR_DISHES: Food[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    category: 'Pizza',
    description: 'Classic Italian pizza topped with fresh mozzarella, basil, and rich tomato sauce.',
    image: '/images/foods/pizza.avif',
    price: 399,
    rating: 4.9
  },
  {
    id: 2,
    name: 'Classic Burger',
    category: 'Burger',
    description: 'Juicy grilled beef patty with fresh lettuce, cheese, tomatoes, and our signature sauce.',
    image: '/images/foods/burger.webp',
    price: 299,
    rating: 4.8
  },
  {
    id: 3,
    name: 'Italian Pasta',
    category: 'Pasta',
    description: 'Creamy Italian pasta tossed with herbs, parmesan cheese, and fresh vegetables.',
    image: '/images/foods/pasta.avif',
    price: 349,
    rating: 4.9
  }
];