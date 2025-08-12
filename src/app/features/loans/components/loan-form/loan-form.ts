// loans/components/loan-form/loan-form.ts
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '../../services';
import { gsap } from 'gsap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './loan-form.html',
  styleUrls: ['./loan-form.css'],
})
export class LoanFormComponent implements AfterViewInit {
  formData = {
    amount: 0,
    purpose: '',
    description: '',
  };

  @ViewChild('submitBtn') submitBtn!: ElementRef;
  @ViewChild('formContainer') formContainer!: ElementRef;

  constructor(private loanService: LoanService, private router: Router) {}

  ngAfterViewInit(): void {
    // انیمیشن ورود فرم (fade + scale)
    gsap.from(this.formContainer.nativeElement, {
      duration: 1,
      opacity: 0,
      scale: 0.85,
      ease: 'power3.out',
    });
  }

  onSubmit(): void {
    // انیمیشن کلیک دکمه (فید و کمی بزرگ شدن)
    gsap.to(this.submitBtn.nativeElement, {
      duration: 0.2,
      scale: 0.9,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
      onComplete: () => {
        // بعد از انیمیشن کلیک، درخواست ارسال شود
        this.loanService.requestLoan(this.formData).subscribe({
          next: () => {
            // انیمیشن موفقیت: تغییر رنگ و متن دکمه
            gsap.to(this.submitBtn.nativeElement, {
              backgroundColor: '#4caf50',
              duration: 0.4,
              onComplete: () => {
                this.submitBtn.nativeElement.textContent = 'ارسال شد ✓';
                // بعد از 1.5 ثانیه ریدایرکت کنیم
                setTimeout(() => this.router.navigate(['/loans']), 1500);
              },
            });
          },
          error: () => {
            // انیمیشن خطا: shake کردن فرم
            gsap.fromTo(
              this.formContainer.nativeElement,
              { x: -10 },
              {
                x: 10,
                duration: 0.1,
                repeat: 5,
                yoyo: true,
                ease: 'power1.inOut',
              }
            );
            alert('خطا در ارسال درخواست وام.');
          },
        });
      },
    });
  }
}
