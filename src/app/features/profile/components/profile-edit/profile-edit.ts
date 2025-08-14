import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/core/models/user.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from 'app/features/auth/services/auth.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.css'],
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
  ) { }
  @ViewChild('submitBtn') submitBtn!: ElementRef;
  @ViewChild('formContainer') formContainer!: ElementRef;

  ngAfterViewInit(): void {
    // انیمیشن ورود فرم (fade + scale)
    gsap.from(this.formContainer.nativeElement, {
      duration: 1,
      opacity: 0,
      scale: 0.85,
      ease: 'power3.out',
    });
  }

  ngOnInit(): void {
    const savedProfileRaw = this.authService.getUserProfile(); // UserProfile | null
const savedProfile: User | null = savedProfileRaw
  ? {
      id: Number(savedProfileRaw.id),
      name: savedProfileRaw.name || '',
      email: savedProfileRaw.email || '',
      phone: savedProfileRaw.phone || '',
      creditScore: savedProfileRaw.creditScore || 0,
      status: savedProfileRaw.status || 'active',
    }
  : null;

    this.profileForm = this.fb.group({
      name: [savedProfile?.name || '', Validators.required],
      email: [
        savedProfile?.email || '',
        [Validators.required, Validators.email],
      ],
      phone: [
        savedProfile?.phone || '',
        [Validators.pattern('^[0-9]{10,15}$')],
      ],
      creditScore: [
        savedProfile?.creditScore || 0,
        [Validators.min(0), Validators.max(900)],
      ],
      status: [savedProfile?.status || 'active'],
    });

    this.loading = false;
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    try {
      await this.authService.updateProfile(this.profileForm.value);
      this.timeoutId = setTimeout(() => {
        this.saving = false;
        alert('پروفایل با موفقیت به‌روزرسانی شد.');
        this.router.navigate(['/profile']);
      }, 1000);
    } catch (error) {
      this.saving = false;
      alert('خطا در به‌روزرسانی پروفایل.');
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

  get controls() {
    return this.profileForm.controls;
  }
  get name() {
    return this.profileForm.get('name');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get phone() {
    return this.profileForm.get('phone');
  }

  get creditScore() {
    return this.profileForm.get('creditScore');
  }

  get status() {
    return this.profileForm.get('status');
  }
}
