// features/profile/components/profile-edit/profile-edit.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { User } from 'app/core/models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.css'],
})
export class ProfileEditComponent implements OnInit {
  profile: User = {
    name: '',
    email: '',
    phone: '',
    creditScore: 0,
    status: 'active',
  };
  loading = true;
  saving = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const savedProfile = this.authService.getUserProfile();
    if (savedProfile) {
      this.profile = { ...savedProfile };
    }
    this.loading = false;
  }

  onSubmit(): void {
    if (this.isValid()) {
      this.saving = true;
      // In a real app, this would call a service to update the backend.
      // For this example, we'll update the AuthService.
      this.authService.updateProfile(this.profile);
      setTimeout(() => {
        this.saving = false;
        alert('پروفایل با موفقیت به‌روزرسانی شد.');
        this.router.navigate(['/profile']);
      }, 1000); // Simulate API call
    }
  }

  isValid(): boolean {
    return !!this.profile.name && !!this.profile.email;
  }
  /**
   * Navigates to the profile page.
   */
  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
