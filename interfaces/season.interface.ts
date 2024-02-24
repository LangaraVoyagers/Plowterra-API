import { IAudit } from "./shared.interface";
import { PayrollTimeframeEnum, StatusEnum } from "../models/Season";

export interface ISeason extends IAudit {
  name: string;
  startDate: number;
  endDate: number;
  payrollTimeframe: keyof typeof PayrollTimeframeEnum;
  price: number;
  status: keyof typeof StatusEnum;
  hasHarvestLog: boolean;
  //productID
  //unitID
  //currencyID
}
