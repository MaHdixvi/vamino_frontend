// dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class DashboardService {
  private apiUrl = 'https://api.example.com/dashboard'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  /**
   * Fetches dashboard statistics (e.g., total sales, new users, etc.)
   */
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      catchError(this.handleError('getDashboardStats', [])) // Handle errors gracefully
    );
  }

  /**
   * Fetches chart data for the dashboard (e.g., bar chart, pie chart)
   */
  getChartData(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/charts`)
      .pipe(catchError(this.handleError('getChartData', [])));
  }

  /**
   * Fetches widget data for the dashboard (e.g., notifications, tasks, etc.)
   */
  getWidgetData(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/widgets`)
      .pipe(catchError(this.handleError('getWidgetData', [])));
  }

  /**
   * Handles HTTP errors and provides fallback data
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Return an empty result or fallback data
      return of(result as T);
    };
  }
}
