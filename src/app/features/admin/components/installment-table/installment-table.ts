// features/admin/components/installment-table/installment-table.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InstallmentDto } from '../../services';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-installment-table',
  standalone: true,
  imports: [DecimalPipe, DatePipe, CommonModule],
  templateUrl: './installment-table.html',
  styleUrls: ['./installment-table.css'],
})
export class InstallmentTable {
  @Input() installments: InstallmentDto[] = [];
  @Output() actionTaken = new EventEmitter<InstallmentDto>();

  // Method to handle actions on an installment (e.g., mark as paid, send reminder)
  onAction(installment: InstallmentDto): void {
    // In a real app, this would trigger an action like sending a notification.
    console.log('Taking action on installment:', installment);
  }
}
