export interface IHarvestLog {
  id?: string;
  seasonId: string;
  pickerId: string;
  collectedAmount: number;
  seasonDeductionIds: Array<string>;
  totalDeduction?: number;
  notes?: string;
}
