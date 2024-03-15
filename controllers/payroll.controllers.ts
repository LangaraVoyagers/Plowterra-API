import { NextFunction, Request, Response } from "express";
import floor from "lodash/floor";
import groupBy from "lodash/groupBy";
import mongoose from "mongoose";
import HarvestLog from "../models/HarvestLog";
import Payroll, { FarmPayroll } from "../models/Payroll";
import SeasonSchema from "../models/Season";
import Message from "../shared/Message";
import { calculatePayrollEndDate } from "../shared/date.helpers";

const message = new Message("payroll");

type ProductionRequest = {
  farmId: string;
  seasonId: string;
  endDate: number;
  startDate?: number;
};

async function getProductionData(payload: ProductionRequest) {
  try {
    const { farmId, seasonId, endDate = Date.now() } = payload;
    let { startDate } = payload;

    const season: any = await SeasonSchema.findOne({
      _id: seasonId,
      deletedAt: null,
      status: "ACTIVE",
    }).populate(["product", "unit", "currency"]);

    if (!season) {
      throw new Error("Season not found");
    }

    const lastPayroll = await FarmPayroll.findOne({ farm: farmId });

    if (!startDate) {
      if (!lastPayroll) {
        startDate = season?.startDate;
      } else {
        startDate = lastPayroll?.nextEstimatedPayroll?.startDate;
      }
    }

    // If the next payroll start date is greated than the current payrrol end date
    // if (!!lastPayroll && lastPayroll.nextEstimatedPayrollDate > endDate) {
    //   throw new Error(
    //     `Invalid end date, Next payroll date starts ${new Date(
    //       lastPayroll.nextEstimatedPayrollDate
    //     )}`
    //   );
    // }

    const data = await HarvestLog.find({
      deletedAt: null,
      season: season?._id,
      settled: false,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate(["picker", "seasonDeductions"]);

    let grossAmount = 0;
    let collectedAmount = 0;
    let deductions = 0;

    const groupedByPicker = groupBy(data, (data: { picker: any }) =>
      data.picker?._id.toString()
    );

    const details = Object.keys(groupedByPicker)
      .filter((picker) => picker !== "undefined")
      .map((pickerId, index) =>
        groupedByPicker[pickerId].reduce(
          (prev, curr: any) => {
            let pickerDeductions = 0;
            curr.seasonDeductions?.forEach(({ _id }: any) => {
              const matchingDeduction = season?.deductions?.find((pd: any) => {
                return pd.deductionID.equals(_id);
              });

              if (matchingDeduction) {
                pickerDeductions += matchingDeduction?.price;
              }
            });

            const gAmount = floor(
              prev.grossAmount + curr.collectedAmount * season?.price,
              2
            );
            return {
              index,
              picker: {
                id: pickerId,
                name: curr.picker?.name,
              },
              collectedAmount: floor(
                prev.collectedAmount + curr.collectedAmount,
                2
              ),
              deductions: floor(pickerDeductions, 2),
              grossAmount: gAmount,
              netAmount: floor(gAmount - pickerDeductions, 2),
            };
          },
          { collectedAmount: 0, grossAmount: 0, netAmount: 0, deductions: 0 }
        )
      );

    const pickersCount = details.length;

    data.forEach((harvestLog) => {
      collectedAmount += harvestLog.collectedAmount;
      grossAmount += harvestLog.collectedAmount * season?.price;
    });

    deductions = details.reduce((prev, curr) => {
      return prev + curr.deductions;
    }, 0);

    const payrollStartDate = new Date(Number(startDate));
    payrollStartDate.setHours(0, 0, 0, 0);

    const nextEstimatedPayroll = {
      startDate: payrollStartDate.getTime(),
      endDate: calculatePayrollEndDate(
        payrollStartDate,
        season.payrollTimeframe
      )?.getTime(),
    };

    return {
      farmId,
      startDate,
      endDate,
      pickersCount,
      season: {
        id: season._id,
        name: season.name,
        currency: season.currency?.name,
        price: season.price,
        product: season.product?.name,
        unit: season.unit?.name,
        payrollTimeframe: season?.payrollTimeframe,
      },
      nextEstimatedPayroll,
      totals: {
        netAmount: floor(grossAmount - deductions, 2),
        collectedAmount: floor(collectedAmount, 2),
        grossAmount: floor(grossAmount, 2),
        deductions: floor(deductions, 2),
      },
      lastPayroll,
      harvestLogIds: data.map((harvestLog) => harvestLog._id),
      details: details,
    };
  } catch (error) {
    throw error;
  }
}

async function getPreview(req: Request, res: Response, next: NextFunction) {
  try {
    const farmId = req.body.farmId;
    const seasonId = req.body.seasonId;
    const endDate = req.body.endDate ?? Date.now();
    const startDate = req.body.startDate;

    const data = await getProductionData({
      farmId,
      seasonId,
      endDate,
      startDate,
    });

    res.status(200).json({
      data,
      error: false,
      message: message.get("success"),
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      data: null,
      error: true,
      message: message.get("error"),
    });
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const farmId = req.body.farmId;
    const seasonId = req.body.seasonId;
    const endDate = req.body.endDate ?? Date.now();
    const startDate = req.body.startDate;

    const expectedTotal = {
      totalGrossAmount: req.body.totals?.totalGrossAmount ?? 0,
      totalCollectedAmount: req.body.totals?.totalCollectedAmount ?? 0,
      totalDeductions: req.body.totals?.totalDeductions ?? 0,
    };

    const payrollData = await getProductionData({
      farmId,
      seasonId,
      endDate: endDate,
      startDate,
    });

    const {
      season,
      pickersCount,
      totals,
      details,
      lastPayroll,
      harvestLogIds,
      nextEstimatedPayroll,
    } = payrollData;

    if (!details.length) {
      return res.status(200).json({
        data: payrollData,
        error: false,
        message: message.get("success"),
      });
    }

    const validAmounts =
      expectedTotal.totalCollectedAmount == totals.collectedAmount &&
      expectedTotal.totalDeductions == totals.deductions &&
      expectedTotal.totalGrossAmount == totals.grossAmount;

    if (!validAmounts) {
      throw new Error(
        `Totals don't match. Received: ${JSON.stringify(
          expectedTotal
        )}. Calculated: ${JSON.stringify(totals)} `
      );
    }

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      try {
        // Create the payroll
        const payroll = new Payroll({
          farm: farmId,
          startDate,
          endDate,
          pickersCount,
          season,
          totals: {
            netAmount: totals.grossAmount - totals.deductions,
            collectedAmount: totals.collectedAmount,
            grossAmount: totals.grossAmount,
            deductions: totals.deductions,
          },
          details: details,
        });
        // Save payroll
        payroll.save({ session });

        if (!lastPayroll) {
          const farmPayroll = new FarmPayroll({
            farm: farmId,
            lastPayroll: payroll._id,
            nextEstimatedPayroll,
            season: seasonId,
          });
          const farmPayrollCreated = await farmPayroll.save({ session });
          console.log("Farm payroll created", farmPayrollCreated._id);
        } else {
          // Update the last payroll of the farm by season
          const farmPayrollUpdated = await FarmPayroll.findOneAndUpdate(
            { farm: farmId, season: season.id },
            {
              lastPayroll: payroll._id,
              nextEstimatedPayroll,
            },
            {
              returnDocument: "after",
              session,
            }
          );
          if (!!farmPayrollUpdated) {
            console.log("Farm payroll updated", farmPayrollUpdated._id);
          } else {
            throw new Error("Farm payroll NOT updated");
          }
        }

        // Update harvest logs with a settled true
        await HarvestLog.updateMany(
          { _id: { $in: harvestLogIds } },
          { $set: { settled: true } },
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        const result = payroll.toObject();
        res.status(200).json({
          data: {
            ...result,
            nextEstimatedPayroll,
          },
          error: false,
          message: message.create("success"),
        });
      } catch (error) {
        console.log({ error });
        console.error("abort transaction");
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({
          data: null,
          error: true,
          message: message.create("error"),
        });
      }
    });
  } catch (error: any) {
    console.log({ error });
    res.status(500).json({
      data: null,
      error: true,
      message: `${message.create("error")} ${error?.message ?? ""}`,
    });
  }
}

function getAll(req: Request, res: Response, next: NextFunction) {
  Payroll.find({})
    .exec()
    .then((data) => {
      res
        .status(200)
        .json({ data, error: false, message: message.get("success") });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.get("error"),
      });
    });
}

function getById(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Payroll.findOne({ _id: id })
    .exec()
    .then((data) => {
      if (!data) {
        res.status(404).json({
          data,
          error: true,
          message: message.get("not_found"),
        });
        return;
      }

      res
        .status(200)
        .json({ data, error: false, message: message.get("success") });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.get("error"),
      });
    });
}

const payrollController = {
  create,
  getAll,
  getById,
  getPreview,
};

export default payrollController;
