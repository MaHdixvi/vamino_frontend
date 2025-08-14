
// installment.model.ts
export interface InstallmentScheduleDto {
  /** شناسه وام */
  loanId: string;
  
  /** مبلغ کل وام */
  totalAmount: number;
  
  /** سود کل */
  totalInterest: number;
  
  /** تعداد اقساط */
  numberOfInstallments: number;
  
  /** لیست اقساط */
  installments: InstallmentDto[];
}

export interface InstallmentDto {
  /** شماره قسط */
  number: number;
  
  /** تاریخ سررسید */
  dueDate: Date;
  
  /** مبلغ اصل */
  principalAmount: number;
  
  /** سود */
  interestAmount: number;
  
  /** جمع کل */
  totalAmount: number;
  
  /** وضعیت قسط */
  status: InstallmentStatus;
  
  /** شناسه یکتا (اختیاری) */
  id?: string;
}

export interface InstallmentScheduleRequestDto {
  /** شناسه وام */
  loanId: string;
  
  /** مبلغ کل وام */
  amount: number;
  
  /** تعداد اقساط */
  numberOfInstallments: number;
}

export interface InstallmentReminderDto {
  /** شناسه کاربر */
  userId: string;
  
  /** شماره قسط */
  installmentNumber: number;
  
  /** شناسه قسط (در صورت وجود) */
  installmentId?: string;
  
  /** تاریخ سررسید */
  dueDate: Date;
}

export interface InstallmentPaymentDto {
  /** شناسه قسط */
  installmentId: string;
  
  /** مبلغ پرداختی */
  amount: number;
  
  /** تاریخ پرداخت */
  paymentDate: Date;
  
  /** روش پرداخت */
  paymentMethod: PaymentMethod;
  
  /** شماره پیگیری */
  trackingNumber?: string;
}

/** وضعیت‌های ممکن برای قسط */
export type InstallmentStatus = 
  | 'pending'    // در انتظار پرداخت
  | 'paid'       // پرداخت شده
  | 'overdue'    // معوق
  | 'cancelled'; // لغو شده

/** روش‌های پرداخت */
export type PaymentMethod = 
  | 'bank_transfer'  // انتقال بانکی
  | 'online_gateway' // درگاه آنلاین
  | 'cash'           // نقدی
  | 'cheque';        // چک

/** نتیجه عملیات API */
export interface Result<T> {
  /** آیا عملیات موفق بود؟ */
  isSuccess: boolean;
  
  /** داده نتیجه */
  data?: T;
  
  /** خطاها (در صورت وجود) */
  errors?: string[];
}

/** پارامترهای دریافت لیست اقساط */
export interface InstallmentListParams {
  /** شناسه وام (اختیاری) */
  loanId?: string;
  
  /** شناسه کاربر (اختیاری) */
  userId?: string;
  
  /** وضعیت قسط (اختیاری) */
  status?: InstallmentStatus;
  
  /** تاریخ شروع (اختیاری) */
  fromDate?: Date;
  
  /** تاریخ پایان (اختیاری) */
  toDate?: Date;
  
  /** شماره صفحه */
  page: number;
  
  /** تعداد در هر صفحه */
  pageSize: number;
}

/** نتیجه صفحه‌بندی شده */
export interface PaginatedResult<T> {
  /** آیتم‌های صفحه جاری */
  items: T[];
  
  /** شماره صفحه جاری */
  pageNumber: number;
  
  /** تعداد کل صفحات */
  totalPages: number;
  
  /** تعداد کل آیتم‌ها */
  totalCount: number;
  
  /** آیا صفحه قبل وجود دارد؟ */
  hasPreviousPage: boolean;
  
  /** آیا صفحه بعد وجود دارد؟ */
  hasNextPage: boolean;
}

// Utility types for frontend
export interface InstallmentSummary {
  totalPaid: number;
  totalUnpaid: number;
  totalOverdue: number;
  upcomingInstallments: InstallmentDto[];
}

/** مدل نمایشی قسط برای کامپوننت‌های فرانت */
export interface InstallmentViewModel extends InstallmentDto {
  /** آیا قسط قابل پرداخت است؟ */
  isPayable: boolean;
  
  /** آیا قسط معوق شده است؟ */
  isOverdue: boolean;
  
  /** روزهای باقیمانده تا سررسید */
  daysRemaining: number;
  
  /** مبلغ قابل پرداخت (با احتساب جریمه احتمالی) */
  payableAmount: number;
}