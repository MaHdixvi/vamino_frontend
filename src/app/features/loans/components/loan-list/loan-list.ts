import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { LoanService } from '../../services';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Loan } from 'app/core/models';
import { gsap } from 'gsap';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './loan-list.html',
  styleUrls: ['./loan-list.css'],
})
export class LoanListComponent implements OnInit, AfterViewInit {
  loans: Loan[] = [];
  loading = true;

  @ViewChildren('loanRow') loanRows!: QueryList<ElementRef>;
  @ViewChild('loanListContainer', { static: true }) loanListContainer!: ElementRef;


  constructor(private loanService: LoanService) { }

  ngOnInit(): void {
    this.loadLoans();
  }

  ngAfterViewInit(): void {
    gsap.from(this.loanListContainer.nativeElement, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    });
    this.loanRows.changes.subscribe(() => {
      if (this.loanRows.length > 0) {
        gsap.from(
          this.loanRows.toArray().map((e) => e.nativeElement),
          {
            opacity: 0,
            x: 50,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }
    });
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
