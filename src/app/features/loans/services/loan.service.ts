// loans/services/loan.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { LoanApplicationDTO, LoanRequestDto } from 'app/core/models/loan.model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/Loan`;

  constructor(private http: HttpClient) {}

  // دریافت تمام وام‌ها (مثلا همه وام‌ها یا همه وام‌های یک کاربر)
  getLoansByUser(userId: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  // دریافت جزئیات یک وام با ID
  getLoanById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ثبت درخواست وام
  requestLoan(data: LoanRequestDto): Observable<LoanRequestDto> {
    return this.http
      .post<LoanRequestDto>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  // به‌روزرسانی وام (اگر API PUT داری)
  updateLoan(
    id: string,
    data: Partial<LoanRequestDto>
  ): Observable<LoanRequestDto> {
    return this.http
      .put<LoanRequestDto>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // حذف وام (اگر API DELETE داری)
  deleteLoan(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'خطایی رخ داده است';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `خطای سمت کلاینت: ${error.error.message}`;
    } else {
      errorMessage = `خطای سرور: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
