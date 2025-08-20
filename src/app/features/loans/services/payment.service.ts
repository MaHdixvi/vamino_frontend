import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import {
  Observable,
  BehaviorSubject,
  interval,
  switchMap,
  takeWhile,
  catchError,
  throwError,
  map,
} from 'rxjs';

export type PaymentMethod = 'POS' | 'ONLINE' | 'CARD';

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  posRequired: boolean;
  paymentUrl?: string;
  message?: string;
}

export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  transactionId?: string;
  amount?: number;
  timestamp?: Date;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly apiUrl = `${environment.apiUrl}/payments`;
  private paymentStatusSubject = new BehaviorSubject<PaymentStatus | null>(
    null
  );

  constructor(private http: HttpClient) {}

  /**
   * Initiate a payment process
   */
  initiatePayment(loanId: string, amount: number): Observable<PaymentResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<PaymentResponse>(
        `${this.apiUrl}/initiate`,
        { loanId, amount },
        { headers }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Connect to physical POS device (simulation mode)
   */
  connectToPOS(paymentId: string, amount: number): Observable<PaymentStatus> {
    console.log(`🔗 Connecting to POS device for payment ${paymentId}`);

    return new Observable<PaymentStatus>((subscriber) => {
      // شبیه‌سازی زمان انتظار
      setTimeout(() => {
        if (Math.random() > 0.2) {
          subscriber.next({
            status: 'completed',
            transactionId: `POS-${Date.now()}`,
            amount,
            timestamp: new Date(),
            message: 'پرداخت با موفقیت از طریق دستگاه POS انجام شد',
          });
        } else {
          subscriber.next({
            status: 'failed',
            amount,
            timestamp: new Date(),
            message: 'اتصال به دستگاه POS با خطا مواجه شد',
          });
        }
        subscriber.complete();
      }, 3000);
    }).pipe(catchError(this.handleError));
  }

  /**
   * Check payment status
   */
  checkPaymentStatus(paymentId: string): Observable<PaymentStatus> {
    return this.http
      .get<PaymentStatus>(`${this.apiUrl}/status/${paymentId}`)
      .pipe(
        map((status) => {
          this.updatePaymentStatus(status);
          return status;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Poll payment status until final state
   */
  pollPaymentStatus(
    paymentId: string,
    intervalMs = 2000
  ): Observable<PaymentStatus> {
    return interval(intervalMs).pipe(
      switchMap(() => this.checkPaymentStatus(paymentId)),
      takeWhile(
        (status) =>
          status.status === 'pending' || status.status === 'cancelled',
        true
      ),
      catchError(this.handleError)
    );
  }

  /**
   * Get payment status observable
   */
  getPaymentStatus(): Observable<PaymentStatus | null> {
    return this.paymentStatusSubject.asObservable();
  }

  /**
   * Update payment status
   */
  updatePaymentStatus(status: PaymentStatus): void {
    this.paymentStatusSubject.next(status);
  }

  /**
   * Complete a payment (for POS or manual confirmation)
   */
  completePayment(
    paymentId: string,
    transactionId: string,
    method: PaymentMethod = 'POS'
  ): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(`${this.apiUrl}/complete`, {
        paymentId,
        transactionId,
        paymentMethod: method,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Cancel a pending payment
   */
  cancelPayment(
    paymentId: string
  ): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(`${this.apiUrl}/cancel`, {
        paymentId,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Verify payment with bank
   */
  verifyWithBank(
    paymentId: string
  ): Observable<{ verified: boolean; message: string }> {
    return this.http
      .get<{ verified: boolean; message: string }>(
        `${this.apiUrl}/verify/${paymentId}`
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Refund a completed payment
   */
  refundPayment(
    paymentId: string
  ): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(`${this.apiUrl}/refund`, {
        paymentId,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    const msg =
      error?.error?.message ||
      error?.message ||
      '❌ خطای ناشناخته در ارتباط با سرویس پرداخت';
    console.error('PaymentService error:', error);
    return throwError(() => new Error(msg));
  }
}
