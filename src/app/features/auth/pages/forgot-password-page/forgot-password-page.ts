// features/auth/components/pages/forgot-password-page/forgot-password-page.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ForgotPassword } from "../../components/forgot-password/forgot-password";

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.html',
  styleUrls: ['./forgot-password-page.css'],
  imports: [ForgotPassword],
})
export class ForgotPasswordPage {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Method to handle the "Forgot Password" form submission
  sendResetLink(): void {
    if (this.email) {
      this.authService.sendPasswordResetEmail(this.email).subscribe({
        next: () => {
          this.successMessage =
            'A password reset link has been sent to your email.';
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = 'Failed to send reset link. Please try again.';
          this.successMessage = '';
          console.error('Password reset failed:', err);
        },
      });
    } else {
      this.errorMessage = 'Please enter your email address.';
      this.successMessage = '';
    }
  }
}
