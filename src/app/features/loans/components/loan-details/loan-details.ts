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
import { InstallmentDto } from '../../../../core/models/installment.model';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PersianDatePipe } from 'app/shared/pipes';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule, PersianDatePipe],
  templateUrl: './loan-details.html',
  styleUrls: ['./loan-details.css'],
})
export class LoanDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  loan: LoanApplicationDTO | null = null;
  installments: InstallmentDto[] = [];
  loading = true;
  error: string | null = null;
  showInstallments = false;
  currentDate = new Date();
  customerSignatureDataUrl: string | null = null;
  officerSignatureDataUrl: string | null = null;
  showSignaturePad = false;
  isCustomerSigning = true;

  @ViewChild('printContainer') printContainer!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  @ViewChild('btnBack') btnBack!: ElementRef;
  @ViewChild('btnPrint') btnPrint!: ElementRef;
  @ViewChild('amountText') amountText!: ElementRef;
  @ViewChild('installmentsText') installmentsText!: ElementRef;
  @ViewChild('purposeText') purposeText!: ElementRef;
  @ViewChild('dateText') dateText!: ElementRef;
  @ViewChild('statusText') statusText!: ElementRef;
  @ViewChild('idText') idText!: ElementRef;
  @ViewChild('userIdText') userIdText!: ElementRef;
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChildren('infoItem') infoItems!: QueryList<ElementRef>;

  private animationTimeline!: gsap.core.Timeline;
  private animationInitialized = false;
  private scrollTriggers: ScrollTrigger[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;

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
    // Initialize animations after data is loaded
  }

  ngOnDestroy(): void {
    this.cleanupAnimations();
  }

  loadLoan(id: string): void {
    this.loading = true;
    this.error = null;

    this.loanService.getLoanById(id).subscribe({
      next: (data) => {
        this.loan = data.data;
        this.loadInstallments(id);
      },
      error: (err) => {
        this.handleError(
          'خطا در بارگذاری اطلاعات وام. لطفا دوباره تلاش کنید.',
          err
        );
      },
    });
  }

  loadInstallments(loanId: string): void {
    this.installmentService.getInstallmentsByLoanId(loanId).subscribe({
      next: (result) => {
        if (result.isSuccess && result.data) {
          this.installments = result.data.sort(
            (a: any, b: any) => Number(a.number) - Number(b.number)
          );
        }
        this.loading = false;
        this.cdr.detectChanges();
        this.initAnimations();
      },
      error: (err) => {
        this.handleError('خطا در بارگذاری اقساط', err);
      },
    });
  }

  private handleError(message: string, error: any): void {
    this.error = message;
    this.loading = false;
    console.error(message, error);
    this.cdr.detectChanges();
  }

  private initAnimations(): void {
    if (this.animationInitialized || !this.loan) return;

    this.cleanupAnimations();
    this.animationInitialized = true;

    gsap.from(this.container.nativeElement, {
      duration: 0.8,
      opacity: 0,
      y: 40,
      ease: 'power3.out',
    });

    this.animationTimeline = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.7 },
    });

    this.animationTimeline.from(
      [this.btnBack.nativeElement, this.btnPrint.nativeElement],
      {
        y: 30,
        opacity: 0,
        stagger: 0.15,
      },
      0.2
    );

    this.animationTimeline.from(
      this.container.nativeElement.querySelector('h2'),
      {
        y: 40,
        opacity: 0,
        scale: 0.9,
      },
      0.3
    );

    this.animationTimeline.from(
      this.infoItems.map((item) => item.nativeElement),
      {
        y: 30,
        opacity: 0,
        stagger: 0.1,
      },
      0.4
    );

    const textTargets = [
      this.amountText,
      this.installmentsText,
      this.purposeText,
      this.dateText,
      this.statusText,
      this.idText,
      this.userIdText,
    ].filter((el) => el?.nativeElement);

    textTargets.forEach((el, i) => {
      const originalText = el.nativeElement.textContent;
      el.nativeElement.textContent = '';

      this.animationTimeline.to(
        el.nativeElement,
        {
          text: originalText,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'none',
        },
        0.5
      );
    });

    this.setupScrollAnimations();
  }

  private setupScrollAnimations(): void {
    const installmentsTrigger = ScrollTrigger.create({
      trigger: '.installments-section',
      start: 'top 80%',
      onEnter: () => {
        gsap.from('.installments-section', {
          y: 50,
          opacity: 0,
          duration: 0.8,
        });
      },
    });
    this.scrollTriggers.push(installmentsTrigger);

    if (this.showInstallments) {
      this.animateInstallments();
    }
  }

  private animateInstallments(): void {
    const items = document.querySelectorAll('.installment-item');
    gsap.from(items, {
      duration: 0.6,
      y: 30,
      opacity: 0,
      stagger: 0.08,
      ease: 'back.out(1.2)',
    });
  }

  private cleanupAnimations(): void {
    if (this.animationTimeline) {
      this.animationTimeline.kill();
    }
    this.scrollTriggers.forEach((trigger) => trigger.kill());
  }

  toggleInstallments(): void {
    this.showInstallments = !this.showInstallments;
    this.cdr.detectChanges();

    if (this.showInstallments) {
      setTimeout(() => this.animateInstallments(), 50);
    }
  }

  // Signature Pad Functions
  initSignaturePad(): void {
    if (!this.signatureCanvas?.nativeElement) {
      console.error('Canvas element not found');
      return;
    }

    const canvas = this.signatureCanvas.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Could not get canvas context');
      return;
    }

    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000';
    this.resizeCanvas();

    // اضافه کردن این خط برای جلوگیری از اسکرول صفحه هنگام امضا
    canvas.style.touchAction = 'none';
  }

  private resizeCanvas(): void {
    if (!this.signatureCanvas?.nativeElement) return;

    const canvas = this.signatureCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  // انواع رویدادها را با یونیون تایپ تعریف کنید
  startDrawing(e: MouseEvent | TouchEvent): void {
    if (!this.ctx || !this.signatureCanvas?.nativeElement) return;

    this.isDrawing = true;
    const rect = this.signatureCanvas.nativeElement.getBoundingClientRect();

    // تشخیص نوع رویداد و گرفتن مختصات صحیح
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

    this.lastX = clientX - rect.left;
    this.lastY = clientY - rect.top;
  }

  draw(e: MouseEvent | TouchEvent): void {
    if (!this.isDrawing || !this.ctx || !this.signatureCanvas?.nativeElement)
      return;

    const rect = this.signatureCanvas.nativeElement.getBoundingClientRect();

    // تشخیص نوع رویداد و گرفتن مختصات صحیح
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  clearSignature(): void {
    if (this.signatureCanvas?.nativeElement && this.ctx) {
      const canvas = this.signatureCanvas.nativeElement;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  saveSignature(): void {
    if (!this.signatureCanvas?.nativeElement) return;

    const dataUrl = this.signatureCanvas.nativeElement.toDataURL();
    if (this.isCustomerSigning) {
      this.customerSignatureDataUrl = dataUrl;
    } else {
      this.officerSignatureDataUrl = dataUrl;
    }
    this.showSignaturePad = false;
    this.clearSignature();

    // If customer signed, request officer signature next
    if (this.isCustomerSigning && !this.officerSignatureDataUrl) {
      setTimeout(() => {
        this.isCustomerSigning = false;
        this.openSignaturePad(false);
      }, 500);
    }
  }

  openSignaturePad(isCustomerSigning: boolean): void {
    this.isCustomerSigning = isCustomerSigning;
    this.showSignaturePad = true;
    this.cdr.detectChanges();
    setTimeout(() => this.initSignaturePad(), 0);
  }

  printLoanDetails(): void {
    if (!this.customerSignatureDataUrl) {
      this.openSignaturePad(true);
      return;
    }

    if (!this.officerSignatureDataUrl) {
      this.openSignaturePad(false);
      return;
    }

    this.generatePrintContent();
  }

  private generatePrintContent(): void {
    if (!this.printContainer?.nativeElement || !this.loan) return;

    const printContent = this.printContainer.nativeElement.innerHTML;
    const originalContent = document.body.innerHTML;
    const originalTitle = document.title;

    document.title = `گزارش وام ${this.loan.id}`;
    document.body.innerHTML = printContent;

    setTimeout(() => {
      window.print();
      document.body.innerHTML = originalContent;
      document.title = originalTitle;
    }, 500);
  }

  // Utility Functions
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

  trackByNumber(index: number, item: InstallmentDto): number {
    return item.number;
  }
  payInstallment(installment: InstallmentDto) {
    const request: {
      LoanId: string|undefined;
      InstallmentNumber: number;
      Amount: number;
      PaymentMethod: string;
    } = {
      LoanId: this.route.snapshot.paramMap.get('id')?.toString(),
      InstallmentNumber: installment.number,
      Amount: installment.totalAmount,
      PaymentMethod: 'Card',
    };
    // فراخوانی سرویس پرداخت قسط
    this.installmentService.payInstallment(request).subscribe({
      next: (res: any) => {
        alert(`قسط شماره ${request.InstallmentNumber} با موفقیت پرداخت شد ✅`);
        this.loadInstallments(this.route.snapshot.paramMap.get('id') || ''); // آپدیت لیست اقساط
      },
      error: (err: any) => {
        console.error(err);
        alert(`خطا در پرداخت قسط شماره ${request.InstallmentNumber}`);
      },
    });
  }
}
