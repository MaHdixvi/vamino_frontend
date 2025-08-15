// features/profile/components/profile-view/profile-view.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from 'app/core/models/user.model';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { AuthService, UserProfile } from 'app/features/auth/services';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-view.html',
  styleUrls: ['./profile-view.css'],
})
export class ProfileViewComponent implements OnInit {
 @ViewChild('profileContainer') profileContainer!: ElementRef;

  profile: UserProfile | null = null;
  loading = true;

  ngAfterViewInit(): void {
    // اطمینان از اینکه DOM لود شده
    gsap.from(this.profileContainer.nativeElement, {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: 'power3.out'
    });
  }
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    // In a real app, this would fetch from a backend service.
    // Here, we get it from the auth service as an example.
     this.authService.getUserProfile().subscribe((profile) => {
      this.profile = profile;
      console.log(this.profile);
      this.loading = false;
    })
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
