import { Request, Response } from "express";
import HarvestLog from "../models/HarvestLog";
import Payroll from "../models/Payroll";
import SeasonSchema from "../models/Season";
import Message from "../shared/Message";

const message = new Message("dashboard");

const POPULATE_SEASON = ["product", "unit", "currency", "endDate"];
const POPULATE_HARVEST_LOG = ["createdAt", "collectedAmount"];
const POPULATE_PAYROLL = ["totals"];

let seasonData: any;
let harvestData: any;
let payrollData: any;
let previousSeasonData: any;
let previousHarvestData: any;
let previousPayrollData: any;

let totalHarvest = 0;
let harvestDays = 0;
let todaysHarvest = 0;
let averageHarvest = 0;
let totalPayroll = 0;
let averagePayroll = 0;
let totalDeductions = 0;

let previousTotalHarvest = 0;
let previousHarvestDays = 0;
let previousAverageHarvest = 0;
let previousTotalPayroll = 0;
let previousAveragePayroll = 0;

const getSeasonData = async (seasonId: any) => {
  try {
    seasonData = await SeasonSchema.findOne({
      _id: seasonId,
      deletedAt: null,
      status: "ACTIVE",
    }).populate(POPULATE_SEASON);
  } catch (error) {
    throw error;
  }
};

const getHarvestData = async (seasonId: any) => {
  try {
    harvestData = await HarvestLog.find({
      deletedAt: null,
      season: seasonId,
    })
      .populate(POPULATE_HARVEST_LOG)
      .exec();
  } catch (error) {
    throw error;
  }
};

const getPayrollData = async () => {
  try {
    payrollData = await Payroll.find({
      // season: seasonId, //TODO: filter by season
    })
      .populate(POPULATE_PAYROLL)
      .exec();
  } catch (error) {
    throw error;
  }
};

const getPreviousSeasonData = async () => {
  try {
    previousSeasonData = await SeasonSchema.findOne(
      {
        status: "Closed",
        deletedAt: null,
        product: seasonData?.product,
        endDate: { $lt: seasonData?.startDate },
      },
      {},
      { sort: { endDate: -1 } }
    ).populate(POPULATE_SEASON);
  } catch (error) {
    throw error;
  }
};

const getPreviousHarvestData = async () => {
  try {
    previousHarvestData = await HarvestLog.find({
      deletedAt: null,
      season: previousSeasonData?._id,
    })
      .populate(POPULATE_HARVEST_LOG)
      .exec();
  } catch (error) {
    throw error;
  }
};

const getPreviousPayrollData = async () => {
  try {
    previousPayrollData = await Payroll.find({
      // season: seasonId, //TODO: filter by season
    })
      .populate(POPULATE_PAYROLL)
      .exec();
  } catch (error) {
    throw error;
  }
};

const getBySeasonId = async (req: Request, res: Response) => {
  const seasonId = req.params.id;

  try {
    await getSeasonData(seasonId);
    await getHarvestData(seasonId);
    await getPayrollData();
    await getPreviousSeasonData();
    await getPreviousHarvestData();
    await getPreviousPayrollData();

    const today = new Date().setHours(0, 0, 0, 0);
    const uniqueDaysSet = new Set();
    let createdAt;

    const previousUniqueDaysSet = new Set();
    let previousCreatedAt;

    harvestData.forEach((harvestLog: any) => {
      if (harvestLog.createdAt > today) {
        todaysHarvest += harvestLog.collectedAmount;
      }

      totalHarvest += harvestLog.collectedAmount;

      createdAt = new Date(harvestLog.createdAt).setHours(0, 0, 0, 0);
      uniqueDaysSet.add(createdAt);
    });

    harvestDays = uniqueDaysSet.size;

    averageHarvest = totalHarvest / harvestDays;

    payrollData.forEach((payroll: any) => {
      totalPayroll += payroll.totals.netAmount;
      totalDeductions += payroll.totals.deductions;
    });

    averagePayroll = totalPayroll / harvestDays;

    previousHarvestData.forEach((harvestLog: any) => {
      previousTotalHarvest += harvestLog.collectedAmount;

      previousCreatedAt = new Date(harvestLog.createdAt).setHours(0, 0, 0, 0);
      previousUniqueDaysSet.add(previousCreatedAt);
    });

    previousHarvestDays = previousUniqueDaysSet.size;
    previousAverageHarvest = previousTotalHarvest / previousHarvestDays;

    previousPayrollData.forEach((payroll: any) => {
      previousTotalPayroll += payroll.totals.netAmount;
    });

    previousAveragePayroll = previousTotalPayroll / previousHarvestDays;

    const data = {
      season: {
        id: seasonData?._id,
        name: seasonData?.name,
        startDate: seasonData?.startDate,
        product: seasonData?.product,
        unit: seasonData?.unit,
        currency: seasonData?.currency,
        price: seasonData?.price,
        endDate: seasonData?.endDate,
      },
      totals: {
        totalHarvest,
        harvestDays,
        todaysHarvest,
        averageHarvest,
        totalPayroll,
        totalDeductions,
      },
      averages: {
        averageHarvest,
        averagePayroll,
        previousAverageHarvest,
        previousAveragePayroll,
      },
    };

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
