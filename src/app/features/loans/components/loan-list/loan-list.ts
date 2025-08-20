import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoanApplicationDTO, LoanRequestDto } from 'app/core/models/loan.model';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'app/features/auth/services';
import { InstallmentService, PaymentService } from '../../services';
import { PersianDatePipe } from '../../../../shared/pipes/persian-date.pipe';
import { finalize } from 'rxjs';
import { InstallmentPaymentDto } from 'app/core/models/installment.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PersianDatePipe],
  templateUrl: './loan-list.html',
  styleUrls: ['./loan-list.css'],
})
export class LoanListComponent implements OnInit, AfterViewInit, OnDestroy {
  loans: LoanApplicationDTO[] = [];
  loading = true;
  paymentLoading: { [key: string]: boolean } = {};

  loanRequest: LoanRequestDto = {
    userId: '',
    requestedAmount: 0,
    numberOfInstallments: 12,
    purpose: '',
  };

  @ViewChildren('loanRow') loanRows!: QueryList<ElementRef>;

  private mm = gsap.matchMedia();
  private ctx?: gsap.Context;

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private installmentserv: InstallmentService
  ) {}

  ngOnInit(): void {
    this.authService.userProfile$.subscribe((user) => {
      if (user?.id) {
        this.loanRequest.userId = user.id;
        this.loadLoans(user.id);
      }
    });
  }

  ngAfterViewInit(): void {
    gsap.registerPlugin(TextPlugin, ScrollTrigger);

    this.loanRows.changes.subscribe(() => {
      this.initResponsiveAnimations();
    });
  }

  ngOnDestroy(): void {
    this.teardownAnimations();
  }

  private loadLoans(userId: string): void {
    this.loading = true;
    this.loanService.getLoansByUser(userId).subscribe({
      next: (res) => {
        this.loans = res.data ?? [];
        this.loading = false;
        setTimeout(() => this.initResponsiveAnimations());
      },
      error: (err) => {
        console.error('Error loading loans', err);
        this.loading = false;
      },
    });
  }

  initiatePayment(loanId: string, installment: LoanApplicationDTO): void {
    if (!loanId || installment.status !=="Approved") {
      this.showError('اطلاعات پرداخت نامعتبر است');
      return;
    }

    this.paymentLoading[loanId] = true;

    this.installmentserv
      .payAllInstallments(loanId, {
        amount: 0,
        installmentId: installment.id,
        paymentDate: new Date(),
        paymentMethod: 'bank_transfer',
        trackingNumber: '12234454534',
      })
      .pipe(finalize(() => (this.paymentLoading[loanId] = false)))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.showSuccess('پرداخت همه اقساط موفقیت‌آمیز بود');
            // بارگذاری مجدد لیست وام‌ها بعد از پرداخت
            this.loadLoans(this.loanRequest.userId);
          } else {
            this.showError(res.errors?.join(', ') || 'خطا در پرداخت اقساط');
          }
        },
        error: (err) => {
          console.error('خطای شبکه یا سرور', err);
          this.showError('خطای شبکه یا سرور در پرداخت اقساط');
        },
      });
  }

  private handlePayment(type: 'POS' | 'ONLINE', loanId: string, response: any) {
    if (type === 'POS') {
      if (!response.paymentId) {
        this.showError('شناسه پرداخت برای دستگاه پوز وجود ندارد');
        return;
      }
      this.connectToPOS(loanId, response.paymentId);
    } else {
      if (!response.paymentUrl) {
        this.showError('لینک پرداخت آنلاین وجود ندارد');
        return;
      }
      this.processOnlinePayment(response.paymentUrl);
    }
  }

  private showError(message: string): void {
    alert(`❌ ${message}`);
  }

  private showSuccess(message: string): void {
    alert(`✅ ${message}`);
  }

  private connectToPOS(loanId: string, paymentId: string): void {
    console.log(`Connecting to POS for payment ${paymentId}`);

    setTimeout(() => {
      this.paymentLoading[loanId] = false;
      this.showSuccess('پرداخت با موفقیت انجام شد');
      this.loadLoans(this.loanRequest.userId);
    }, 3000);
  }

  private processOnlinePayment(paymentUrl: string): void {
    window.open(paymentUrl, '_blank');
    this.paymentLoading = {};
  }

  private initResponsiveAnimations(): void {
    this.teardownAnimations();
    if (!this.loanRows?.length) return;

    const cards = this.loanRows.toArray().map((r) => r.nativeElement);

    this.ctx = gsap.context(() => {
      this.mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(cards, { opacity: 1, clearProps: 'all' });
      });

      this.mm.add('(min-width: 1024px)', () => {
        cards.forEach((el: HTMLElement, i: number) => {
          gsap.from(el, {
            opacity: 0,
            x: -60,
            duration: 0.6,
            delay: i * 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      });

      this.mm.add('(max-width: 1023px)', () => {
        cards.forEach((el: HTMLElement, i: number) => {
          gsap.from(el, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            delay: i * 0.04,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      });
    });
  }

  private teardownAnimations(): void {
    this.ctx?.revert();
    this.ctx = undefined;
    this.mm?.revert();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }

  submitLoanRequest(): void {
    if (!this.loanRequest.userId || this.loanRequest.requestedAmount <= 0) {
      this.showError('لطفاً همه فیلدهای لازم را پر کنید.');
      return;
    }

    this.loanService.requestLoan(this.loanRequest).subscribe({
      next: () => {
        this.showSuccess('درخواست وام با موفقیت ارسال شد.');
        this.loanRequest = {
          userId: this.loanRequest.userId,
          requestedAmount: 0,
          numberOfInstallments: 12,
          purpose: '',
        };
        this.loadLoans(this.loanRequest.userId);
      },
      error: (err) => {
        this.showError(
          'خطا در ارسال درخواست وام: ' + (err?.message || 'نامشخص')
        );
      },
    });
  }
}
