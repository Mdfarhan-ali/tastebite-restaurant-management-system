import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  imports: [RouterLink],
  templateUrl: './admin-profile.html'
})
export class AdminProfile implements OnInit {

  private authService = inject(AuthService);

  user: any = null;

  ngOnInit(): void {
    this.user = this.authService.user();
  }
}