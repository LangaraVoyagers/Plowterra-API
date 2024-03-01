import { NextFunction, Response, Request } from "express";
import Payroll, { FarmPayroll } from "../models/Payroll";
import Message from "../shared/Message";
import SeasonSchema from "../models/Season";
import HarvestLog from "../models/HarvestLog";
import groupBy from "lodash/groupBy";
import mongoose from "mongoose";

const message = new Message("payroll");

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const farmId = req.body.farmId;
    const seasonId = req.body.seasonId;
    const endDate = req.body.endDate ?? Date.now();
    const expectedTotal = {
      totalGrossAmount: req.body.totals?.totalGrossAmount ?? 0,
      totalCollectedAmount: req.body.totals?.totalCollectedAmount ?? 0,
      totalDeductions: req.body.totals?.totalDeductions ?? 0,
    };

    let startDate: null | number = null;

    const season: any = await SeasonSchema.findOne({
      _id: seasonId,
      deletedAt: null,
      status: "ACTIVE",
    }).populate(["product", "unit", "currency"]);

    if (!season) {
      return res
        .status(404)
        .json({ data: null, error: true, message: message.create("error") });
    }

    const lastPayroll = await FarmPayroll.findOne({ farm: farmId });

    if (!lastPayroll) {
      startDate = season?.startDate;
    } else {
      startDate = lastPayroll.nextEstimatedPayrollDate;
    }

    // If the next payroll start date is greated than the current payrrol end date
    if (!!lastPayroll && lastPayroll.nextEstimatedPayrollDate > endDate) {
      throw new Error(
        `Invalid end date, Next payroll date starts ${new Date(
          lastPayroll.nextEstimatedPayrollDate
        )}`
      );
    }

    const data = await HarvestLog.find({
      deletedAt: null,
      season: season?._id,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("picker");

    let grossAmount = 0;
    let collectedAmount = 0;
    let deductions = 0;
    const groupedByPicker = groupBy(data, (data: { picker: any }) =>
      data.picker?._id.toString()
    );

    const details = Object.keys(groupedByPicker)
      .filter((picker) => picker !== "undefined")
      .map((pickerId) =>
        groupedByPicker[pickerId].reduce(
          (prev, curr: any) => {
            return {
              picker: {
                id: pickerId,
                name: curr.picker?.name,
              },
              collectedAmount: prev.collectedAmount + curr.collectedAmount,
              deductions: 0,
              grossAmount:
                prev.grossAmount + curr.collectedAmount * season?.price,
              netAmount:
                prev.grossAmount + curr.collectedAmount * season?.price,
            };
          },
          { collectedAmount: 0, grossAmount: 0, netAmount: 0 }
        )
      );
    const pickersCount = details.length;

    data.forEach((harvestLog) => {
      collectedAmount += harvestLog.collectedAmount;
      grossAmount += harvestLog.collectedAmount * season?.price;
      // deductions = 0
    });

    const expected = Object.values(expectedTotal)
      .map(Number)
      .reduce((prev, curr) => prev + curr, 0);

    const calculated = [grossAmount, collectedAmount, deductions].reduce(
      (prev, curr) => prev + curr,
      0
    );
    if (expected !== calculated) {
      throw new Error(
        `Totals don't match. Expected: ${expected}, Calculated: ${calculated}`
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
          season: {
            id: season._id,
            name: season.name,
            currency: season.currency.name,
            price: season.price,
            product: season.product.name,
            unit: season.unit.name,
          },
          totals: {
            netAmount: grossAmount - deductions,
            collectedAmount,
            grossAmount,
            deductions,
          },
          details: details,
        });
        // Save payroll
        payroll.save({ session });

        // Calculating next payroll date for this season
        const payrollEndDate = new Date(Number(endDate));
        payrollEndDate.setDate(payrollEndDate.getDate() + 1);
        const nextEstimatedPayrollDate = payrollEndDate.getTime();

        if (!lastPayroll) {
          const farmPayroll = new FarmPayroll({
            farm: farmId,
            lastPayroll: payroll._id,
            nextEstimatedPayrollDate,
            season: seasonId,
          });
          const farmPayrollCreated = await farmPayroll.save({ session });
          console.log("Farm payroll created", farmPayrollCreated._id);
        } else {
          // Update the last payroll of the farm by season
          const farmPayrollUpdated = await FarmPayroll.findOneAndUpdate(
            { farm: farmId, season: season._id },
            {
              lastPayroll: payroll._id,
              nextEstimatedPayrollDate,
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
          { _id: { $in: data.map((harvestLog) => harvestLog._id) } },
          { $set: { settled: true } },
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        const result = payroll.toObject();
        res.status(200).json({
          data: { ...result, nextEstimatedPayrollDate },
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
      message: `${message.create("error")} ${error?.message ?? ''}`,
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
};

export default payrollController;
