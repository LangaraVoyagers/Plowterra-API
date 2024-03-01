import { NextFunction, Response, Request } from "express";
import Payroll, { FarmPayroll } from "../models/Payroll";
import Message from "../shared/Message";
import SeasonSchema from "../models/Season";
import HarvestLog from "../models/HarvestLog";
import groupBy from "lodash/groupBy";

const message = new Message("payroll");

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const farmId = req.body.farmId;
    const seasonId = req.body.seasonId;
    const endDate = req.body.endDate ?? Date.now();

    let season: any = null;
    let startDate = null;

    const payload = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      season: req.body.seasonId,
      totals: {
        totalGrossAmount: req.body.totals?.totalGrossAmount ?? 0,
        totalCollectedAmount: req.body.totals?.totalCollectedAmount ?? 0,
        totalDeductions: req.body.totals?.totalDeductions ?? 0,
      },
    };

    const lastPayroll = await FarmPayroll.findOne({ farm: farmId });

    if (!lastPayroll) {
      season = await SeasonSchema.findOne({
        _id: seasonId,
        deletedAt: null,
        status: "ACTIVE",
      }).populate(["product", "unit", "currency"]);

      if (!season) {
        return res
          .status(404)
          .json({ data: null, error: true, message: message.create("error") });
      }
      startDate = season?.startDate;
    }

    const data = await HarvestLog.find({
      deletedAt: null,
      season: season?._id,
      createdAt: {
        $gte: startDate,
        $lte: Date.now(),
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

    res.status(200).json({
      data: {
        details: details,
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
      },
      error: false,
      message: message.create("success"),
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
