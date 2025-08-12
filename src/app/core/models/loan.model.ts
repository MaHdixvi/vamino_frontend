export interface Loan {
  id: number;
  amount: number;
  status: string;
  userId: number;
  purpose?: string;
  date?: string;

}
