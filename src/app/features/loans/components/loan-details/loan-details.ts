import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../../../core/models/loan.model';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-details.html',
  styleUrls: ['./loan-details.css'],
})
export class LoanDetailsComponent implements OnInit, AfterViewInit {
  loan: Loan | null = null;
  loading = true;
  error: string | null = null;

  @ViewChild('container') container!: ElementRef;
  @ViewChild('amountText') amountText!: ElementRef;
  @ViewChild('statusText') statusText!: ElementRef;
  @ViewChild('btnBack') btnBack!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'شناسه وام معتبر نیست.';
      this.loading = false;
      return;
    }
    this.loadLoan(id);
  }

  ngAfterViewInit(): void {
    gsap.from(this.container.nativeElement, {
      duration: 1,
      opacity: 0,
      y: 40,
      rotationX: 15,
      ease: 'power4.out',
    });

    // انیمیشن دکمه بازگشت
    gsap.from(this.btnBack.nativeElement, {
      duration: 0.6,
      scale: 0.8,
      opacity: 0,
      ease: 'elastic.out(1, 0.5)',
      delay: 1,
    });
  }

  loadLoan(id: number): void {
    this.loading = true;
    this.error = null;
    this.loanService.getLoanById(id).subscribe({
      next: (data) => {
        this.loan = data;
        this.loading = false;

        const amountStr = this.loan
          ? this.loan.amount.toLocaleString() + ' تومان'
          : '';
        const statusLabel = this.getStatusLabel(this.loan?.status || '');

        // انیمیشن نوشتن مقدار وام (typing effect)
        gsap.to(this.amountText.nativeElement, {
          duration: 2,
          text: amountStr,
          ease: 'power1.out',
        });

        // انیمیشن نوشتن وضعیت
        gsap.to(this.statusText.nativeElement, {
          duration: 1.5,
          text: statusLabel,
          ease: 'power1.out',
          delay: 0.5,
          onComplete: () => {
            // افکت موج نور روی وضعیت
            gsap.to(this.statusText.nativeElement, {
              boxShadow: '0 0 20px 3px #4caf50',
              repeat: -1,
              yoyo: true,
              duration: 1.2,
              ease: 'power1.inOut',
            });
          },
        });

        // انیمیشن کارت‌های info-item با چرخش و بالا آمدن
        gsap.from('.info-item', {
          duration: 0.8,
          opacity: 0,
          y: 40,
          rotationZ: 10,
          stagger: 0.25,
          ease: 'back.out(1.7)',
        });
      },
      error: (err) => {
        this.error = 'خطا در بارگذاری اطلاعات وام.';
        console.error('Error loading loan details', err);
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/loans']);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'در انتظار بررسی',
      approved: 'تایید شده',
      rejected: 'رد شده',
    };
    return labels[status] || status;
  }
}
