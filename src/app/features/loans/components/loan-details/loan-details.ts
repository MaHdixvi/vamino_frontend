import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { InstallmentService } from '../../services/installment.service';
import { LoanApplicationDTO } from '../../../../core/models/loan.model';
import {
  InstallmentDto,
  InstallmentScheduleDto,
} from '../../../../core/models/installment.model';
import { CommonModule } from '@angular/common';
import { CSSPlugin, gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(TextPlugin, ScrollTrigger, CSSPlugin);

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-details.html',
  styleUrls: ['./loan-details.css'],
})
export class LoanDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  loan: LoanApplicationDTO | null = null;
  installments: InstallmentDto[] = [];
  loading = true;
  error: string | null = null;
  showInstallments = false;

  @ViewChild('container') container!: ElementRef;
  @ViewChild('btnBack') btnBack!: ElementRef;
  @ViewChild('amountText') amountText!: ElementRef;
  @ViewChild('installmentsText') installmentsText!: ElementRef;
  @ViewChild('purposeText') purposeText!: ElementRef;
  @ViewChild('dateText') dateText!: ElementRef;
  @ViewChild('statusText') statusText!: ElementRef;
  @ViewChild('idText') idText!: ElementRef;
  @ViewChild('userIdText') userIdText!: ElementRef;
  @ViewChildren('infoItem') infoItems!: QueryList<ElementRef>;

  private animationTimeline!: gsap.core.Timeline;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private installmentService: InstallmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'شناسه وام معتبر نیست.';
      this.loading = false;
      return;
    }
    this.loadLoan(id);
  }

  ngAfterViewInit(): void {
    if (this.loan) {
      this.initAnimations();
    }
  }

  ngOnDestroy(): void {
    if (this.animationTimeline) {
      this.animationTimeline.kill();
    }
  }

  loadLoan(id: string): void {
    this.loading = true;
    this.error = null;

    this.loanService.getLoanById(id).subscribe({
      next: (data) => {
        this.loan = data.data;
        this.loadInstallments(id);
        this.cdr.detectChanges();

        setTimeout(() => {
          this.initAnimations();
        }, 50);
      },
      error: (err) => {
        this.error = 'خطا در بارگذاری اطلاعات وام. لطفا دوباره تلاش کنید.';
        console.error('Error loading loan details', err);
        this.loading = false;
      },
    });
  }

  loadInstallments(loanId: string): void {
    this.installmentService.getInstallmentsByLoanId(loanId).subscribe({
      next: (result) => {
        if (result.isSuccess && result.data) {
          this.installments = result.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading installments', err);
        this.loading = false;
      },
    });
  }

  toggleInstallments(): void {
    this.showInstallments = !this.showInstallments;
  }

  initAnimations(): void {
    if (!this.loan) return;

    this.animationTimeline = gsap.timeline();

    // Container animation
    this.animationTimeline.from(this.container.nativeElement, {
      duration: 0.8,
      opacity: 0,
      y: 40,
      ease: 'power3.out',
    });

    // Back button animation
    this.animationTimeline.from(
      this.btnBack.nativeElement,
      {
        duration: 0.6,
        scale: 0.8,
        opacity: 0,
        ease: 'elastic.out(1, 0.5)',
      },
      0.2
    );

    // Text animations
    this.animationTimeline.to(
      this.amountText.nativeElement,
      {
        duration: 1,
        text: `${this.loan.requestedAmount?.toLocaleString('fa-IR')} تومان`,
        ease: 'power2.out',
      },
      0.4
    );

    this.animationTimeline.to(
      this.installmentsText.nativeElement,
      {
        duration: 0.8,
        text: `${this.loan.numberOfInstallments.toString()} قسط`,
        ease: 'power2.out',
      },
      0.5
    );

    this.animationTimeline.to(
      this.purposeText.nativeElement,
      {
        duration: 0.8,
        text: this.loan.purpose,
        ease: 'power2.out',
      },
      0.6
    );

    this.animationTimeline.to(
      this.dateText.nativeElement,
      {
        duration: 0.8,
        text: this.formatDate(this.loan.submitDate),
        ease: 'power2.out',
      },
      0.7
    );

    this.animationTimeline.to(
      this.statusText.nativeElement,
      {
        duration: 0.8,
        text: this.getStatusLabel(this.loan.status),
        ease: 'power2.out',
      },
      0.8
    );

    this.animationTimeline.to(
      this.idText.nativeElement,
      {
        duration: 0.8,
        text: this.loan.id,
        ease: 'power2.out',
      },
      0.9
    );

    this.animationTimeline.to(
      this.userIdText.nativeElement,
      {
        duration: 0.8,
        text: this.loan.userId,
        ease: 'power2.out',
      },
      1.0
    );

    // Info items animation
    this.animationTimeline.from(
      this.infoItems.map((item) => item.nativeElement),
      {
        duration: 0.8,
        opacity: 0,
        y: 40,
        stagger: 0.15,
        ease: 'back.out(1.7)',
      },
      0.4
    );
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'در انتظار بررسی',
      approved: 'تایید شده',
      rejected: 'رد شده',
      paid: 'پرداخت شده',
      overdue: 'معوق',
    };
    return statusMap[status.toLowerCase()] || status;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('fa-IR');
  }

  goBack(): void {
    this.router.navigate(['/loans']);
  }
}
