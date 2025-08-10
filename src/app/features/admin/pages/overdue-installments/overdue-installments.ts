// features/admin/pages/overdue-installments/overdue-installments.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService, InstallmentDto } from '../../services/admin.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { InstallmentTable } from "../../components";

@Component({
  selector: 'app-overdue-installments',
  standalone: true,
  imports: [ CommonModule, InstallmentTable],
  templateUrl: './overdue-installments.html',
  styleUrls: ['./overdue-installments.css'],
})
export class OverdueInstallments implements OnInit {
  installments: InstallmentDto[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOverdueInstallments();
  }

  loadOverdueInstallments(): void {
    this.adminService.getOverdueInstallments().subscribe({
      next: (data) => {
        this.installments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading overdue installments', err);
        this.loading = false;
      },
    });
  }

  // Method to handle actions on an overdue installment (e.g., send a reminder)
  onAction(installment: InstallmentDto): void {
    // In a real app, this would trigger an action like sending a notification.
    console.log('Taking action on installment:', installment);
    alert(`عملیات برای قسط #${installment.number} انجام شد.`);
  }
}
