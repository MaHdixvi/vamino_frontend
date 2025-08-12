import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { User } from 'app/core/models/user.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.css'], // اصلاح این قسمت
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  loading = true;
  saving = false;
  private timeoutId: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedProfile: User | null = this.authService.getUserProfile();

    this.profileForm = this.fb.group({
      name: [savedProfile?.name || '', Validators.required],
      email: [
        savedProfile?.email || '',
        [Validators.required, Validators.email],
      ],
      phone: [
        savedProfile?.phone || '',
        [Validators.pattern('^[0-9]{10,15}$')], // اعتبارسنجی شماره
      ],
      creditScore: [
        savedProfile?.creditScore || 0,
        [Validators.min(0), Validators.max(900)],
      ],
      status: [savedProfile?.status || 'active'],
    });

    this.loading = false;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.saving = true;
      try {
        this.authService.updateProfile(this.profileForm.value);
        this.timeoutId = setTimeout(() => {
          this.saving = false;
          alert('پروفایل با موفقیت به‌روزرسانی شد.');
          this.router.navigate(['/profile']);
        }, 1000);
      } catch (error) {
        this.saving = false;
        alert('خطا در به‌روزرسانی پروفایل.');
      }
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  // دسترسی سریع به کنترل‌ها
  get f() {
    return this.profileForm.controls;
  }

  get name() {
    return this.f['name'];
  }

  get email() {
    return this.f['email'];
  }

  get phone() {
    return this.f['phone'];
  }

  get creditScore() {
    return this.f['creditScore'];
  }

  get status() {
    return this.f['status'];
  }
}
