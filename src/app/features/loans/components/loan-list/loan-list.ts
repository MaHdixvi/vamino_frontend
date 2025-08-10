// loans/components/loan-list/loan-list.ts
import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../services';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Loan } from 'app/core/models';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule,RouterModule,CommonModule],
  templateUrl: './loan-list.html',
  styleUrls: ['./loan-list.css'],
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = [];
  loading = true;

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getLoans().subscribe({
      next: (data) => {
        this.loans = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading loans', err);
        this.loading = false;
      },
    });
  }
}
