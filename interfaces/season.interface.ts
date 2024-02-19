export interface ISeason {
    startDate: number;
    endDate: number;
    pickersCount: number;
    totals: {
      grossAmount: number;
      collectedAmount: number;
      deductions: number;
      netAmount: number; // Calculated value
    };
    // details: Array<IPayrollDetail>;
  }