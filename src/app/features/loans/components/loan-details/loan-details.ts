// loans/components/loan-details/loan-details.component.ts
import { Component, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../../../core/models/loan.model';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule,DecimalPipe,CommonModule],
  templateUrl: './loan-details.html',
  styleUrls: ['./loan-details.css'],
})
export class LoanDetailsComponent implements OnInit {
  loan: Loan | null = null;
  loading = true;
  error: string | null = null;

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

  loadLoan(id: number): void {
    this.loanService.getLoanById(id).subscribe({
      next: (data) => {
        this.loan = data;
        this.loading = false;
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
