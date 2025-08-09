// models/response.model.ts

export interface ApiResponse<T> {
  success: boolean; // وضعیت موفقیت آمیز بودن پاسخ
  message?: string; // پیام مرتبط با پاسخ (اختیاری)
  data?: T; // داده‌های بازگشتی (اختیاری و نوع آن قابل تنظیم است)
  errors?: any[]; // لیست خطاها در صورت وجود (اختیاری)
}

// مثال استفاده:
// const response: ApiResponse<User> = {
//   success: true,
//   message: 'User fetched successfully',
//   data: { id: 1, name: 'John Doe', email: 'john@example.com' }
// };
