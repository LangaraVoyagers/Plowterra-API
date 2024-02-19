import { IAudit } from "./shared.iterface";

export interface ISeason extends IAudit{
  name: string;
  startDate: number;
  endDate: number;
  payroll_timeframe: string; //enum
  price: number;
  status: string; //enum
  has_harvest_log: boolean;
  //product_id
  //unit_id
  //currency_id
}
