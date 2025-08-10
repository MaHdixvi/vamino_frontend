// features/admin/components/loan-approval-card/loan-approval-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanRequestDto } from '../../services';

@Component({
  selector: 'app-loan-approval-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-approval-card.html',
  styleUrls: ['./loan-approval-card.css'],
})
export class LoanApprovalCard {
  @Input() application!: LoanRequestDto;
  @Output() statusUpdate = new EventEmitter<{
    id: string;
    status: 'Approved' | 'Rejected';
    reason?: string;
  }>();

  showReasonInput = false;
  rejectionReason = '';

  approve(): void {
    this.statusUpdate.emit({ id: this.application.id, status: 'Approved' });
  }

  reject(): void {
    if (this.showReasonInput) {
      if (this.rejectionReason.trim()) {
        this.statusUpdate.emit({
          id: this.application.id,
          status: 'Rejected',
          reason: this.rejectionReason,
        });
        this.showReasonInput = false;
        this.rejectionReason = '';
      } else {
        alert('لطفاً دلیل رد درخواست را وارد کنید.');
      }
    } else {
      this.showReasonInput = true;
    }
  }
}
