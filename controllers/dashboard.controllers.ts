import { Request, Response } from "express";
import HarvestLog from "../models/HarvestLog";
import Payroll from "../models/Payroll";
import SeasonSchema from "../models/Season";
import Message from "../shared/Message";

const message = new Message("dashboard");

const POPULATE_SEASON = [
  //   {
  //     path: "farm",
  //     model: "Farm",
  //     select: "name address",
  //   },
  "product",
  "unit",
  "currency",
];

const POPULATE_HARVEST_LOG = ["createdAt", "collectedAmount"];

const POPULATE_PAYROLL = ["totals"];

async function getDashboardData(seasonId: any) {
  try {
    const season: any = await SeasonSchema.findOne({
      _id: seasonId,
      deletedAt: null,
      status: "ACTIVE",
    }).populate(POPULATE_SEASON);

    const harvestData = await HarvestLog.find({
      deletedAt: null,
      season: season?._id,
    })
      .populate(POPULATE_HARVEST_LOG)
      .exec();

    const payrollData = await Payroll.find({
      // season: season?._id,
    })
      .populate(POPULATE_PAYROLL)
      .exec();

    console.log({ payrollData });

    let totalHarvest = 0;
    let harvestDays = 0;
    let todaysHarvest = 0;
    let previousDaysHarvest = 0;
    let totalPayroll = 0;
    let totalDeductions = 0;

    const today = new Date().setHours(0, 0, 0, 0);
    const previousDay = today - 86400000;

    harvestData.forEach((harvestLog: any) => {
      if (harvestLog.createdAt > today) {
        todaysHarvest += harvestLog.collectedAmount;
      }

      if (harvestLog.createdAt > previousDay && harvestLog.createdAt < today) {
        previousDaysHarvest += harvestLog.collectedAmount;
      }

      totalHarvest += harvestLog.collectedAmount;

      if (harvestLog?.createdAt > season?.startDate) {
        harvestDays++; //TODO: fix this logic
      }
    });

    payrollData.forEach((payroll: any) => {
      totalPayroll += payroll.totals.netAmount;
      totalDeductions += payroll.totals.deductions;
    });

    return {
      season: {
        id: season?._id,
        name: season?.name,
        startDate: season?.startDate,
        product: season?.product,
        unit: season?.unit,
        currency: season?.currency,
        price: season?.price,
      },
      totals: {
        totalHarvest,
        harvestDays,
        todaysHarvest,
        previousDaysHarvest,
        totalPayroll,
        totalDeductions,
      },
    };
  } catch (error) {
    throw error;
  }
}

const getBySeasonId = async (req: Request, res: Response) => {
  try {
    const seasonId = req.params.id;

    const data = await getDashboardData(seasonId);

    return res.status(200).json({
      data,
      error: false,
      message: message.get("success"),
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      data: null,
      error: true,
      message: message.get("error"),
    });
  }
};

const dashboardController = {
  getBySeasonId,
};

export default dashboardController;
