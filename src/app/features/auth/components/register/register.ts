// auth/components/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports:[FormsModule,CommonModule],
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Method to handle registration form submission
  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.username && this.password && this.email) {
      this.authService
        .register(this.username, this.email, this.password)
        .subscribe({
          next: () => {
            // Redirect to the login page or dashboard on successful registration
            this.router.navigate(['/auth/login']);
          },
          error: (err) => {
            this.errorMessage = 'Registration failed. Please try again.';
            console.error('Registration failed:', err);
          },
        });
    } else {
      this.errorMessage = 'Please fill in all fields';
    }
  }
}
