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
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {

  loading = signal(false);

  resetForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),

    confirmPassword: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const password =
      this.resetForm.value.password!;

    const confirmPassword =
      this.resetForm.value.confirmPassword!;

    if (password !== confirmPassword) {

      alert('Passwords do not match.');

      return;
    }

    const token =
      localStorage.getItem('resetToken');

    if (!token) {

      alert(
        'Reset token not found. Please request a new reset link.'
      );

      this.router.navigate([
        '/auth/forgot-password'
      ]);

      return;
    }

    this.loading.set(true);

    this.authService.resetPassword({
      token: token,
      newPassword: password
    }).subscribe({

      next: () => {

        this.loading.set(false);

        localStorage.removeItem('resetToken');

        alert(
          'Password reset successfully!'
        );

        this.router.navigate([
          '/auth/login'
        ]);
      },

      error: (error) => {

        this.loading.set(false);

        console.error(error);

        alert(
          error?.error?.message ||
          'Unable to reset password.'
        );
      }

    });
  }
}