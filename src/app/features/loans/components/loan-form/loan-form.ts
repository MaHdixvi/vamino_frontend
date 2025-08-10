// loans/components/loan-form/loan-form.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '../../services';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [],
  templateUrl: './loan-form.html',
  styleUrls: ['./loan-form.css'],
})
export class LoanFormComponent {
  formData = {
    amount: 0,
    purpose: '',
    description: '',
  };

  constructor(private loanService: LoanService, private router: Router) {}

  onSubmit(): void {
    this.loanService.requestLoan(this.formData).subscribe({
      next: (response) => {
        alert('درخواست وام با موفقیت ارسال شد.');
        this.router.navigate(['/loans']);
      },
      error: (err) => {
        alert('خطا در ارسال درخواست وام.');
        console.error(err);
      },
    });
  }
}
