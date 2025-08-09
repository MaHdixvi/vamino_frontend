// features/dashboard/components/dashboard-header/dashboard-header.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.html',
  styleUrls: ['./dashboard-header.css'],
})
export class DashboardHeaderComponent {
  title: string = 'Dashboard'; // Title of the dashboard
  user: string = 'John Doe'; // Example user data (can be fetched dynamically)
  notifications: number = 5; // Example notification count (can be fetched dynamically)

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Logs out the user by calling the AuthService and redirects to the login page.
   */
  logout(): void {
    this.authService.logout()
  }
}
