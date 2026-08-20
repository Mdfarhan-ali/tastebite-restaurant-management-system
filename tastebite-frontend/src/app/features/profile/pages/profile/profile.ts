import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports : [RouterLink],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {

  private authService = inject(AuthService);

  user: any = null;

  ngOnInit(): void {
    this.user = this.authService.user();
  }
}