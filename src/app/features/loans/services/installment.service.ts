import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { InstallmentDto, InstallmentReminderDto, InstallmentScheduleDto, InstallmentScheduleRequestDto, Result } from 'app/core/models/installment.model';

@Injectable({
  providedIn: 'root',
})
export class InstallmentService {
  private readonly apiUrl = `${environment.apiUrl}/api/installments`;

  constructor(private http: HttpClient) {}

  /**
   * Generate installment schedule for a loan
   * @param request Installment schedule request data
   * @returns Observable of installment schedule result
   */
  generateInstallmentSchedule(
    request: InstallmentScheduleRequestDto
  ): Observable<Result<InstallmentScheduleDto>> {
    return this.http.post<Result<InstallmentScheduleDto>>(
      `${this.apiUrl}/schedule`,
      request
    );
  }

  /**
   * Get installments by loan ID
   * @param loanId The loan ID to get installments for
   * @returns Observable of installment list result
   */
  getInstallmentsByLoanId(
    loanId: string
  ): Observable<Result<InstallmentDto[]>> {
    return this.http.get<Result<InstallmentDto[]>>(
      `${this.apiUrl}/by-loan/${loanId}`
    );
  }

  /**
   * Send payment reminder for an installment
   * @param reminder Installment reminder data
   * @returns Observable of operation result
   */
  sendReminder(reminder: InstallmentReminderDto): Observable<Result<void>> {
    return this.http.post<Result<void>>(
      `${this.apiUrl}/send-reminder`,
      reminder
    );
  }

  /**
   * Get upcoming installments for a user
   * @param userId The user ID
   * @param count Number of installments to retrieve (default: 5)
   * @returns Observable of upcoming installments result
   */
  getUpcomingInstallments(
    userId: string,
    count: number = 5
  ): Observable<Result<InstallmentDto[]>> {
    return this.http.get<Result<InstallmentDto[]>>(
      `${this.apiUrl}/upcoming/${userId}?count=${count}`
    );
  }
}
