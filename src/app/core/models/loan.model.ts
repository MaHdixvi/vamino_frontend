export interface LoanApplicationDTO {
  id: string;
  numberOfInstallments: number;
  purpose: string;
  requestedAmount: number;
  status: string;
  submitDate: string;
  userId: string;
}

export interface LoanRequestDto {
  id?: string;
  userId: string;
  requestedAmount: number;
  numberOfInstallments: number;
  purpose: string;
}
