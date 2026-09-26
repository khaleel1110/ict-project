import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent {

  loginForm: FormGroup;

  errorMessage = '';
  isLoading = false;
  showPassword = false;

  readonly currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
      password: [
        '',
        Validators.required,
      ],
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async submit(): Promise<void> {

    if (this.isLoading) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.loginForm.get('email')?.value?.trim();
    const password = this.loginForm.get('password')?.value;

    try {

      await this.auth.login(email, password);

      await this.router.navigate([
        '/admin/dashboard',
      ]);

    } catch (error: any) {

      this.errorMessage = this.mapError(error);

    } finally {

      this.isLoading = false;

    }
  }

  private mapError(error: any): string {

    switch (error?.code) {

      case 'auth/invalid-email':
        return 'The email address entered is not valid.';

      case 'auth/user-disabled':
        return 'This administrator account has been disabled.';

      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'The email address or password is incorrect.';

      case 'auth/too-many-requests':
        return 'Too many unsuccessful attempts. Please wait a moment and try again.';

      case 'auth/network-request-failed':
        return 'Unable to connect to the authentication service. Check your internet connection and try again.';

      default:
        return error?.message ||
          'Unable to sign in at this time. Please try again.';
    }
  }
}
