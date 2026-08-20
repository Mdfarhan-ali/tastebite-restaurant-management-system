export interface Testimonial {
  id: number;
  name: string;
  location: string;
  review: string;
  rating: number;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, USA',
    avatar: 'SJ',
    review: 'Absolutely loved the food and ambiance. Every dish was fresh, flavorful, and beautifully presented.',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Brown',
    location: 'London, UK',
    avatar: 'MB',
    review: 'Excellent service with delicious meals. One of the best dining experiences I have ever had.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emily Davis',
    location: 'Toronto, Canada',
    avatar: 'ED',
    review: 'Amazing atmosphere, friendly staff, and outstanding food. Highly recommended for family dinners.',
    rating: 5
  }
];