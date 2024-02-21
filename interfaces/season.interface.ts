import { IAudit } from "./shared.iterface";
import { PayrollTimeframeEnum, StatusEnum } from "../models/Season";

export interface ISeason extends IAudit {
  name: string;
  startDate: number;
  endDate: number;
  payrollTimeframe: `${PayrollTimeframeEnum}`;
  price: number;
  status: `${StatusEnum}`;
  hasHarvestLog: boolean;
  //productID
  //unitID
  //currencyID
}
