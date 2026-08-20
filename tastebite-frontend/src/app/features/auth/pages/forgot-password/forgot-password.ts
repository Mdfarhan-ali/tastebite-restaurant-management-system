import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  loading = signal(false);

  forgotForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const data = {
      email: this.forgotForm.value.email!
    };

    this.authService.forgotPassword(data).subscribe({

      next: (token) => {

        this.loading.set(false);

        // Development only
        localStorage.setItem(
          'resetToken',
          token
        );

        alert(
          'Reset token generated successfully.'
        );

        this.router.navigate([
          '/auth/reset-password'
        ]);
      },

      error: (error) => {

        this.loading.set(false);

        console.error(error);

        alert(
          error?.error?.message ||
          'Unable to process your request.'
        );
      }

    });
  }
}