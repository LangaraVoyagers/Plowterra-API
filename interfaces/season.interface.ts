import { IAudit } from "./shared.iterface";

export interface ISeason extends IAudit {
  name: string;
  startDate: number;
  endDate: number;
  payrollTimeframe: string; //enum
  price: number;
  status: string; //enum
  hasHarvestLog: boolean;
  //productID
  //unitID
  //currencyID
}
