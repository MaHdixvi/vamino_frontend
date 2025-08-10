// features/profile/components/profile-view/profile-view.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/services';
import { User } from 'app/core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-view.html',
  styleUrls: ['./profile-view.css'],
})
export class ProfileViewComponent implements OnInit {
  profile: User | null = null;
  loading = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    // In a real app, this would fetch from a backend service.
    // Here, we get it from the auth service as an example.
    this.profile = this.authService.getUserProfile();
    this.loading = false;
  }
  getScoreClass(score: number): string {
    if (score >= 700) {
      return 'credit-good';
    } else if (score >= 500) {
      return 'credit-fair';
    } else {
      return 'credit-poor';
    }
  }
}
