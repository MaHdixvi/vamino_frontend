// loans/components/loan-list/loan-list.ts
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,
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

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './loan-list.html',
  styleUrls: ['./loan-list.css'],
})
export class LoanListComponent implements OnInit, AfterViewInit, OnDestroy {
  loans: LoanApplicationDTO[] = [];
  loading = true;

  loanRequest: LoanRequestDto = {
    userId: '',
    requestedAmount: 0,
    numberOfInstallments: 0,
    purpose: '',
  };

  @ViewChildren('loanRow') loanRows!: QueryList<ElementRef>;

  private mm = gsap.matchMedia();
  private ctx?: gsap.Context;

  constructor(
    private loanService: LoanService,
    private authserv: AuthService
  ) {}

  ngOnInit(): void {
    this.authserv.userProfile$.subscribe((user) => {
      if (user?.id) {
        this.loanRequest.userId = user.id;
        this.loadLoans(user.id);
      }
    });
  }

  ngAfterViewInit(): void {
    gsap.registerPlugin(TextPlugin, ScrollTrigger);

    // هر بار کارت‌های جدید رندر شدن، انیمیشن‌ها رو دوباره بساز
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

        // صبر کن DOM آپدیت شه
        setTimeout(() => this.initResponsiveAnimations());
      },
      error: (err) => {
        console.error('Error loading loans', err);
        this.loading = false;
      },
    });
  }

  /** انیمیشن‌های ریسپانسیو: دسکتاپ (x از راست)، موبایل/تبلت (y از پایین) + احترام به reduced-motion */
  private initResponsiveAnimations(): void {
    this.teardownAnimations(); // پاکسازی قبلی

    if (!this.loanRows?.length) return;
    const cards = this.loanRows.toArray().map((r) => r.nativeElement);

    this.ctx = gsap.context(() => {
      // اگر کاربر reduced-motion خواسته، فقط فید ساده
      this.mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(cards, { opacity: 1, clearProps: 'all' });
      });

      // دسکتاپ و بزرگ‌تر
      this.mm.add('(min-width: 1024px)', () => {
        cards.forEach((el: HTMLElement, i: number) => {
          gsap.from(el, {
            opacity: 0,
            x: -60, // RTL: از راست وارد
            duration: 0.6,
            delay: i * 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse', // برگشت با اسکرول به بالا
            },
          });
        });
      });

      // موبایل و تبلت
      this.mm.add('(max-width: 1023px)', () => {
        cards.forEach((el: HTMLElement, i: number) => {
          gsap.from(el, {
            opacity: 0,
            y: 30, // فضای افقی کم، از پایین وارد شه بهتره
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

  /** پاکسازی کامل انیمیشن‌ها و ScrollTriggerها */
  private teardownAnimations(): void {
    this.ctx?.revert();
    this.ctx = undefined;
    this.mm?.revert();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }

  submitLoanRequest(): void {
    if (!this.loanRequest.userId || this.loanRequest.requestedAmount <= 0) {
      alert('لطفاً همه فیلدهای لازم را پر کنید.');
      return;
    }

    this.loanService.requestLoan(this.loanRequest).subscribe({
      next: () => {
        alert('درخواست وام با موفقیت ارسال شد.');
        this.loanRequest = {
          userId: '',
          requestedAmount: 0,
          numberOfInstallments: 12,
          purpose: '',
        };
      },
      error: (err) => {
        alert('خطا در ارسال درخواست وام: ' + err.message);
      },
    });
  }
}
