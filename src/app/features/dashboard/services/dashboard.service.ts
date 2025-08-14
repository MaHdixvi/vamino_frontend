// installment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InstallmentService {
  private apiUrl = `${environment.apiUrl}/installment`;

  constructor(private http: HttpClient) {}

  generateSchedule(request: {
    loanId: string;
    amount: number;
    numberOfInstallments: number;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/schedule`, request)
      .pipe(catchError(this.handleError('generateSchedule', {})));
  }

  getByLoanId(loanId: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/by-loan/${loanId}`)
      .pipe(catchError(this.handleError('getByLoanId', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
