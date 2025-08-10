// loans/services/loan.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Loan } from 'app/core/models';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/Loan`;

  constructor(private http: HttpClient) {}

  // دریافت لیست وام‌ها
  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl);
  }

  // دریافت جزئیات یک وام
  getLoanById(id: number): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${id}`);
  }

  // ارسال درخواست وام جدید
  requestLoan(data: any): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, data);
  }

  // بروزرسانی وام (مثلاً توسط مدیر)
  updateLoan(id: number, data: any): Observable<Loan> {
    return this.http.put<Loan>(`${this.apiUrl}/${id}`, data);
  }

  // حذف وام
  deleteLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
