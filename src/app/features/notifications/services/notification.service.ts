// notification/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'environments/environment';

// The interface for a notification, matching the structure used in the components.
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class NotificationService {
  // Replace with the actual API endpoint from your backend.
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches the list of notifications for the current user.
   * @returns An Observable of an array of Notification objects.
   */
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl).pipe(
      // Convert string timestamps from the API to Date objects.
      map((notifications) =>
        notifications.map((n) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }))
      ),
      catchError(this.handleError<Notification[]>('getNotifications', []))
    );
  }

  /**
   * Marks a specific notification as read.
   * @param id The ID of the notification to mark as read.
   * @returns An Observable that completes when the operation is successful.
   */
  markAsRead(id: number): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/${id}/read`, {})
      .pipe(catchError(this.handleError<void>('markAsRead')));
  }

  /**
   * Deletes a specific notification.
   * @param id The ID of the notification to delete.
   * @returns An Observable that completes when the operation is successful.
   */
  deleteNotification(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError<void>('deleteNotification')));
  }

  /**
   * Creates a new notification (useful for debugging or admin functions).
   * @param notification The notification object to create.
   * @returns An Observable of the created Notification.
   */
  createNotification(
    notification: Omit<Notification, 'id'>
  ): Observable<Notification> {
    return this.http
      .post<Notification>(this.apiUrl, notification)
      .pipe(catchError(this.handleError<Notification>('createNotification')));
  }

  /**
   * A generic error handler that logs the error and returns a safe value.
   * @param operation The name of the operation that failed.
   * @param result The optional value to return as the observable result.
   * @returns A function that handles the error.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Return a safe result to prevent the app from crashing.
      return of(result as T);
    };
  }
}
