export interface IPayroll {
  start_date: number;
  end_date: number;
  total_pickers: number;
  totals: {
    total_gross_amount: number;
    total_collected_amount: number;
    total_deductions: number;
    total_paid: number; // Calculated value
  };
  details: Array<IPayrollDetail>;
}

export interface IPayrollDetail {
  picker: { id: string; name: string }; // TODO: add the picker interface
  gross_amount: number;
  collected_amount: number;
  deductions: number;
  net_amount: number;
  total_pickers: number;
}
