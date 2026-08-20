import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './admin-layout.html'
})
export class AdminLayout {

  // ============================================
  // Mobile Sidebar
  // ============================================

  sidebarOpen = false;


  // ============================================
  // Navigation Items
  // ============================================

  navItems = [
    {
      label: 'Dashboard',
      route: '/admin'
    },
    {
      label: 'Foods',
      route: '/admin/foods'
    },
    {
      label: 'Orders',
      route: '/admin/orders'
    },
    {
      label: 'Reservations',
      route: '/admin/reservations'
    }
  ];


  // ============================================
  // Open Sidebar
  // ============================================

  openSidebar(): void {
    this.sidebarOpen = true;
  }


  // ============================================
  // Close Sidebar
  // ============================================

  closeSidebar(): void {
    this.sidebarOpen = false;
  }


  // ============================================
  // Toggle Sidebar
  // ============================================

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }


  // ============================================
  // Navigation
  // Close mobile sidebar after clicking link
  // ============================================

  navigate(): void {
    this.closeSidebar();
  }

}