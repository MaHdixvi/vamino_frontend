// features/admin/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

// Import the DTOs from the API
export interface LoanRequestDto {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  creditScore: number;
  // Add other properties as defined in the backend
}

export interface InstallmentDto {
  number: number;
  dueDate: string;
  totalAmount: number;
  status: 'Overdue' | 'Paid' | 'Pending';
  // Add other properties as defined in the backend
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // Base URL for the Admin API
  private readonly baseUrl = `${environment.apiUrl}/admin`; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  /**
   * Fetches all loan applications for admin review.
   */
  getAllLoanApplications(): Observable<LoanRequestDto[]> {
    const url = `${this.baseUrl}`;
    return this.http.get<LoanRequestDto[]>(url);
  }

  /**
   * Fetches details of a specific loan application.
   */
  getLoanApplication(id: string): Observable<LoanRequestDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<LoanRequestDto>(url);
  }

  /**
   * Updates the status of a loan application.
   */
  // features/admin/services/admin.service.ts

  updateApplicationStatus(
    id: string,
    status: 'Approved' | 'Rejected',
    reason?: string
  ): Observable<void> {
    const url = `${this.baseUrl}/${id}/status`;

    let params = new HttpParams().set('status', status);
    if (reason) {
      params = params.set('reason', reason);
    }

    return this.http.put<void>(url, {}, { params });
  }

  /**
   * Fetches all overdue installments.
   */
  getOverdueInstallments(): Observable<InstallmentDto[]> {
    const url = `${this.baseUrl}/overdue-installments`;
    return this.http.get<InstallmentDto[]>(url);
  }
}
