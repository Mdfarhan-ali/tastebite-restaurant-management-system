import { Routes } from '@angular/router';

import { CustomerLayout } from './layouts/customer-layout/customer-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

import { Home } from './features/home/pages/home/home';

import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { ForgotPassword } from './features/auth/pages/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/pages/reset-password/reset-password';

import { NotFound } from './features/errors/not-found/not-found';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Menu } from './features/menu/pages/menu/menu';
import { FoodDetails } from './features/menu/pages/food-details/food-details';
import { Cart } from './features/cart/pages/cart/cart';
import { Checkout } from './features/orders/pages/checkout/checkout';
import { Orders } from './features/orders/pages/orders/orders';
import { Reservation } from './features/reservation/pages/my-reservations/reservation';

import { Profile } from './features/profile/pages/profile/profile';
import { MyReservations } from './features/reservation/pages/my-reservations/my-reservations';
import { OrderDetails } from './features/orders/pages/order-details/order-details';

import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminDashboard } from './features/admin/pages/dashboard/dashboard';

import { Foods } from './features/admin/pages/foods/foods';
import { FoodForm } from './features/admin/pages/food-form/food-form';

import { AdminOrders } from './features/admin/pages/orders/orders';
import { Reservations } from './features/admin/pages/reservations/reservations';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { AdminProfile } from './features/admin/pages/admin-profile/admin-profile';
import { Gallery } from './features/gallery/gallery';
import { About } from './features/about/about';
import { Contact } from './features/contact/contact';

export const routes: Routes = [

  // Customer Routes
  {
    path: '',
    component: CustomerLayout,
    children: [
      {
        path: '',
        component: Home
      },
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard, roleGuard(['CUSTOMER'])]
      },
      {
        path: 'profile',
        component: Profile,
        canActivate: [
          authGuard,
          roleGuard(['CUSTOMER'])
        ]
      },

      {
        path: 'menu',
        component: Menu
      },

      {
        path: 'menu/:id',
        component: FoodDetails
      },

      {
        path: 'cart',
        component: Cart
      },

      {
        path: 'checkout',
        component: Checkout
      },

      {
        path: 'orders',
        component: Orders
      },

      {
        path: 'reservation',
        component: Reservation
      },

      {
        path: 'reservations',
        component: MyReservations
      },
      {
        path: 'orders/:id',
        component: OrderDetails
      },
      {
        path: 'about',
        component: About
      },
      {
        path: 'gallery',
        component: Gallery
      },
      {
        path: 'contact',
        component: Contact
      },

    ]
  },

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [
      authGuard,
      roleGuard(['ADMIN'])
    ],
    children: [
      {
        path: '',
        component: AdminDashboard
      },
      {
        path: 'foods',
        component: Foods
      },
      {
        path: 'foods/new',
        component: FoodForm
      },
      {
        path: 'foods/edit/:id',
        component: FoodForm
      },

      {
        path: 'orders',
        component: AdminOrders
      },
      {
        path: 'reservations',
        component: Reservations
      },
      {
        path: 'admin-profile',
        component: AdminProfile
      }
    ]
  },

  // Authentication Routes
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: 'register',
        component: Register
      },
      {
        path: 'forgot-password',
        component: ForgotPassword
      },
      {
        path: 'reset-password',
        component: ResetPassword
      },

      {
        path: 'app-admin-dashboard',
        component: AdminDashboard
      }
    ]
  },

  // 404
  {
    path: '**',
    component: NotFound
  }

];