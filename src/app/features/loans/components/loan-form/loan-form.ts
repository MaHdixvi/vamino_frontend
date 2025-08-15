import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '../../services';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'app/features/auth/services';
import { take } from 'rxjs/operators';
import { LoanRequestDto } from 'app/core/models';
import { NgIf, DatePipe, DecimalPipe, NgFor, CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { InstallmentService } from '../../services/installment.service';
import {
  InstallmentScheduleDto,
  InstallmentScheduleRequestDto,
} from 'app/core/models/installment.model';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [FormsModule, NgIf, DatePipe, DecimalPipe, NgFor,CommonModule],
  templateUrl: './loan-form.html',
  styleUrls: ['./loan-form.css'],
})
export class LoanFormComponent implements AfterViewInit, OnDestroy {
  userId: string | null = null;
  isSubmitting = false;
  showInstallmentSchedule = false;
  installmentSchedule: InstallmentScheduleDto | null = null;
  formData: LoanRequestDto = {
    userId: '',
    requestedAmount: 1000000,
    purpose: '',
    numberOfInstallments: 12,
  };

  @ViewChild('formContainer') formContainer!: ElementRef;
  @ViewChild('amountGroup') amountGroup!: ElementRef;
  @ViewChild('purposeGroup') purposeGroup!: ElementRef;
  @ViewChild('installmentsGroup') installmentsGroup!: ElementRef;
  @ViewChild('submitBtn') submitBtn!: ElementRef;
  @ViewChild('scheduleContainer') scheduleContainer!: ElementRef;

  private animations: gsap.core.Tween[] = [];

  constructor(
    private loanService: LoanService,
    private installmentService: InstallmentService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initAnimations();
      this.loadUserData();
    });
  }

  ngOnDestroy(): void {
    this.animations.forEach((anim) => anim.kill());
  }

  private initAnimations(): void {
    this.animations.push(
      gsap.from(this.formContainer.nativeElement, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      })
    );
  }

  private loadUserData(): void {
    this.authService.userProfile$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user?.id) {
          this.userId = user.id;
          this.formData.userId = this.userId;
          this.cdr.markForCheck();
        }
      },
      error: () => this.showError('خطا در بارگذاری اطلاعات کاربر'),
    });
  }

  onInputFocus(group: HTMLDivElement): void {
    gsap.to(group, {
      y: -3,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  onInputBlur(group: HTMLDivElement): void {
    gsap.to(group, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  onButtonHover(): void {
    if (!this.submitBtn.nativeElement.disabled) {
      gsap.to(this.submitBtn.nativeElement, {
        y: -2,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }

  onButtonLeave(): void {
    gsap.to(this.submitBtn.nativeElement, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  previewInstallmentSchedule(): void {
    if (
      !this.userId ||
      this.formData.requestedAmount <= 0 ||
      this.formData.numberOfInstallments <= 0
    ) {
      return;
    }

    const request: InstallmentScheduleRequestDto = {
      loanId: 'preview',
      amount: this.formData.requestedAmount,
      numberOfInstallments: this.formData.numberOfInstallments,
    };

    this.installmentService.generateInstallmentSchedule(request).subscribe({
      next: (result) => {
        if (result.isSuccess && result.data) {
          this.installmentSchedule = result.data;
          this.showInstallmentSchedule = true;
          this.animateScheduleAppearance();
        } else {
          this.showError('خطا در محاسبه اقساط');
        }
      },
      error: () => this.showError('خطا در ارتباط با سرور'),
    });
  }

  private animateScheduleAppearance(): void {
    gsap.from(this.scheduleContainer.nativeElement, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  onSubmit(): void {
    if (!this.userId || this.isSubmitting) return;

    this.isSubmitting = true;
    this.animateButtonClick().then(() => {
      this.submitLoanRequest();
    });
  }

  private animateButtonClick(): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(this.submitBtn.nativeElement, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        onComplete: () => resolve(),
      });
    });
  }

  private submitLoanRequest(): void {
    this.loanService.requestLoan(this.formData).subscribe({
      next: (loan) => {
        this.installmentService.generateInstallmentSchedule({
          amount: this.formData.requestedAmount,
          loanId: loan.data.id,
          numberOfInstallments:this.formData.numberOfInstallments
        }).subscribe({
          next: (result) => {
           console.log(result);
            this.handleSuccess(loan.data.id == null ? '' : loan.data.id);
          },
          error: () => this.showError('خطا در محاسبه اقساط'),
        })
      },
      error: () => {
        this.handleError();
      },
    });
  }

  private handleSuccess(loanId: string): void {
    this.isSubmitting = false;
    this.showSuccessAnimation();

    setTimeout(() => {
      this.router.navigate(['/loans', loanId]);
    }, 1500);
  }

  private handleError(): void {
    this.isSubmitting = false;
    this.showError('خطا در ارسال درخواست وام');
    this.shakeForm();
  }

  private showSuccessAnimation(): void {
    gsap.to(this.submitBtn.nativeElement, {
      backgroundColor: '#4CAF50',
      duration: 0.5,
    });
  }

  private shakeForm(): void {
    gsap.to(this.formContainer.nativeElement, {
      x: -10,
      duration: 0.05,
      repeat: 5,
      yoyo: true,
    });
  }

  private showError(message: string): void {
    console.error(message);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fa-IR').format(value);
  }
}
