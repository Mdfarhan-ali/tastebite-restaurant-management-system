import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { NAVIGATION } from '../../../core/constants/navigation';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  // ======================================================
  // SERVICES
  // ======================================================

  public authService = inject(AuthService);
  private router = inject(Router);
  public cartService = inject(CartService);


  // ======================================================
  // NAVIGATION
  // ======================================================

  navigation = NAVIGATION;


  // ======================================================
  // MOBILE MENU
  // ======================================================

  isMenuOpen = signal(false);


  toggleMenu(): void {

    this.isMenuOpen.update(value => !value);

  }


  // ======================================================
  // PROFILE NAVIGATION
  // ======================================================

  openProfile(): void {

  const user = this.authService.user();

  console.log('Logged-in user:', user);
  console.log('User role:', user?.role);

  if (!user) {
    this.router.navigate(['/auth/login']);
    return;
  }

  const role = user.role?.toString().toLowerCase();

  if (role === 'admin') {

    console.log('Opening Admin Profile');

    this.router.navigate(['/admin/admin-profile']);

  } else {

    console.log('Opening Customer Profile');

    this.router.navigate(['/profile']);

  }

}


  // ======================================================
  // LOGOUT
  // ======================================================

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/auth/login']);

  }

}