// dashboard-page.ts
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { DashboardChartsComponent, DashboardHeaderComponent, DashboardWidgets } from '../../components';
import { InstallmentDto, Result } from 'app/core/models/installment.model';
import { LoanApplicationDTO } from 'app/core/models';
import { LoanService } from 'app/features/loans/services';
import { InstallmentService } from '../../services';
import { AuthService } from 'app/features/auth/services';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardHeaderComponent,
    DashboardWidgets,
    DashboardChartsComponent,
  ],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.css'],
})
export class DashboardPageComponent implements OnInit {
  installmentsData: InstallmentDto[] = [];
  loansData: LoanApplicationDTO[] = [];
  loading = true;
  error: string | null = null;
  userId: string | null = null;

  constructor(
    private loanService: LoanService,
    private installmentService: InstallmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.userProfile$.subscribe((profile) => {
      if (profile?.id) {
        this.userId = profile.id;
        this.loadDashboardData();
      }
    });
  }

  loadDashboardData() {
    if (!this.userId) {
      this.handleError('شناسه کاربر نامعتبر است');
      return;
    }

    this.loading = true;
    this.error = null;

    this.loanService.getLoansByUser(this.userId).subscribe({
      next: (loansResult: Result<LoanApplicationDTO[]>) => {
        if (loansResult.isSuccess && loansResult.data) {
          this.loansData = loansResult.data;
          this.loadInstallments(loansResult.data.map((loan) => loan.id));
        } else {
          this.handleError(
             'خطا در دریافت اطلاعات وام‌ها'
          );
        }
      },
      error: (err) => {
        this.handleError('خطا در ارتباط با سرور');
      },
    });
  }

  loadInstallments(loanIds: string[]) {
    const allInstallments: InstallmentDto[] = [];
    let completedRequests = 0;

    if (loanIds.length === 0) {
      this.loading = false;
      return;
    }

    loanIds.forEach((loanId) => {
      this.installmentService.getByLoanId(loanId).subscribe({
        next: (installmentsResult: Result<InstallmentDto[]>) => {
          if (installmentsResult.isSuccess && installmentsResult.data) {
            allInstallments.push(...installmentsResult.data);
          }
          completedRequests++;

          if (completedRequests === loanIds.length) {
            this.installmentsData = allInstallments;
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Error loading installments', err);
          completedRequests++;

          if (completedRequests === loanIds.length) {
            this.installmentsData = allInstallments;
            this.loading = false;
          }
        },
      });
    });
  }

  handleError(message: string) {
    this.error = message;
    this.loading = false;
    console.error(message);
  }
}
