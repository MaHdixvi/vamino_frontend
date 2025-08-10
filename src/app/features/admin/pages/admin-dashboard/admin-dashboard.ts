// features/admin/pages/admin-dashboard/admin-dashboard.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard {
  // Dashboard statistics
  stats = {
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    overdueInstallments: 0,
  };

  loading = true;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // In a real app, you would call API endpoints to get this data.
    // For this example, we'll use the AdminService to get the data.
    this.adminService.getAllLoanApplications().subscribe({
      next: (applications) => {
        this.stats.totalApplications = applications.length;
        this.stats.pendingApplications = applications.filter(
          (app) => app.status === 'Pending'
        ).length;
        this.stats.approvedApplications = applications.filter(
          (app) => app.status === 'Approved'
        ).length;
        this.stats.rejectedApplications = applications.filter(
          (app) => app.status === 'Rejected'
        ).length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading loan applications', err);
        this.loading = false;
      },
    });

    this.adminService.getOverdueInstallments().subscribe({
      next: (installments) => {
        this.stats.overdueInstallments = installments.length;
      },
      error: (err) => {
        console.error('Error loading overdue installments', err);
      },
    });
  }

  navigateToApproval(): void {
    this.router.navigate(['/admin/loan-approval']);
  }

  navigateToOverdue(): void {
    this.router.navigate(['/admin/overdue-installments']);
  }
}
