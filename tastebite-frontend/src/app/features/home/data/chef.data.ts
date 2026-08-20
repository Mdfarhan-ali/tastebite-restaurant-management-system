interface Chef {
  id: number;
  name: string;
  role: string;
  image: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

export const CHEFS = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Head Chef',
    image: '/images/chefs/chefs-1.jpeg',
    instagram: '#',
    facebook: '#',
    twitter: '#'
  },
  {
    id: 2,
    name: 'Emma Watson',
    role: 'Pastry Chef',
    image: '/images/chefs/Chefs-3.jpg',
    instagram: '#',
    facebook: '#',
    twitter: '#'
  },
  {
    id: 3,
    name: 'David Miller',
    role: 'Sous Chef',
    image: '/images/chefs/chef2.jpg',
    instagram: '#',
    facebook: '#',
    twitter: '#'
  }
];