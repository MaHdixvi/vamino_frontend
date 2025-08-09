import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router'; // For navigation after login
import { AuthService } from '../../services/auth.service'; // Example service for authentication
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports:[FormsModule,CommonModule],
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  username: string = ''; // To store the username input
  password: string = ''; // To store the password input
  errorMessage: string = ''; // To display error messages

  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  // Method to handle login form submission
  login(): void {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password)
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }
}
