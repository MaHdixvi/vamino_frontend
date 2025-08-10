// features/admin/pages/loan-approval/loan-approval.component.ts
import { Component, OnInit, Pipe } from '@angular/core';
import { AdminService, LoanRequestDto } from '../../services/admin.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { LoanApprovalCard } from "../../components";

@Component({
  selector: 'app-loan-approval',
  standalone: true,
  imports: [ CommonModule, LoanApprovalCard],
  templateUrl: './loan-approval.html',
  styleUrls: ['./loan-approval.css'],
})
export class LoanApproval implements OnInit {
  applications: LoanRequestDto[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.adminService.getAllLoanApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading loan applications', err);
        this.loading = false;
      },
    });
  }

  onStatusUpdate(
    id: string,
    status: 'Approved' | 'Rejected',
    reason?: string
  ): void {
    this.adminService.updateApplicationStatus(id, status, reason).subscribe({
      next: () => {
        this.applications = this.applications.filter((app) => app.id !== id);
        alert(
          `درخواست وام با موفقیت ${status === 'Approved' ? 'تایید' : 'رد'} شد.`
        );
      },
      error: (err) => {
        console.error('Error updating application status', err);
        alert('خطا در به‌روزرسانی وضعیت درخواست.');
      },
    });
  }
}
