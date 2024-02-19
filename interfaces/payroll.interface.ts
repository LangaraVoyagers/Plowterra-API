export interface IPayroll {
  startDate: number;
  endDate: number;
  pickersCount: number;
  totals: {
    grossAmount: number;
    collectedAmount: number;
    deductions: number;
    netAmount: number; // Calculated value
  };
  details: Array<IPayrollDetail>;
}

export interface IPayrollDetail {
  picker: { id: string; name: string }; // TODO: add the picker interface
  grossAmount: number;
  collectedAmount: number;
  deductions: number;
  netAmount: number;
  pickersCount: number;
}
