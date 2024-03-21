import { Request, Response } from "express";
import HarvestLog from "../models/HarvestLog";
import Payroll, { FarmPayroll } from "../models/Payroll";
import SeasonSchema from "../models/Season";
import Message from "../shared/Message";

const message = new Message("dashboard");

const POPULATE_SEASON = [
  "product",
  "unit",
  "currency",
  "endDate",
  "payrollTimeframe",
];
const POPULATE_HARVEST_LOG = ["createdAt", "collectedAmount"];
const POPULATE_PAYROLL = ["totals"];

const getSeasonData = async (seasonId: any) => {
  try {
    return await SeasonSchema.findOne({
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
    return await HarvestLog.find({
      deletedAt: null,
      season: seasonId,
    })
      .populate(POPULATE_HARVEST_LOG)
      .exec();
  } catch (error) {
    throw error;
  }
};

const getPayrollData = async (seasonId: any) => {
  try {
    return await Payroll.find({
      "season.id": seasonId,
    })
      .populate(POPULATE_PAYROLL)
      .exec();
  } catch (error) {
    throw error;
  }
};

const getPreviousSeasonData = async (seasonData: any) => {
  try {
    return await SeasonSchema.findOne(
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

const getPreviousHarvestData = async (previousSeasonData: any) => {
  try {
    return await HarvestLog.find({
      deletedAt: null,
      season: previousSeasonData?._id,
    })
      .populate(POPULATE_HARVEST_LOG)
      .exec();
  } catch (error) {
    throw error;
  }
};

const getPreviousPayrollData = async (previousSeasonData: any) => {
  try {
    return await Payroll.find({
      "season.id": previousSeasonData?.id,
    })
      .populate(POPULATE_PAYROLL)
      .exec();
  } catch (error) {
    throw error;
  }
};

type ProductionRequest = {
  farmId: string;
  seasonData?: any;
};

const getPayrollToTodayData = async (payload: ProductionRequest) => {
  try {
    const { farmId, seasonData } = payload;

    const endDate = Date.now();
    let startDate;
    let grossAmount = 0;

    const lastPayroll = await FarmPayroll.findOne({ farm: farmId });

    if (!lastPayroll) {
      startDate = seasonData?.startDate;
    } else {
      startDate = lastPayroll?.nextEstimatedPayroll?.startDate;
    }

    const data = await HarvestLog.find({
      deletedAt: null,
      season: seasonData?._id,
      settled: false,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate(POPULATE_HARVEST_LOG);

    data.forEach((harvestLog) => {
      grossAmount += harvestLog.collectedAmount * seasonData?.price;
    });

    return {
      grossAmount,
    };
  } catch (error) {
    throw error;
  }
};

const getRecentPayrollData = async (seasonData: any) => {
  try {
    return await Payroll.find({
      "season.id": seasonData?.id,
    })
      .sort({ createdAt: -1 })
      .select("+createdAt")
      .populate(POPULATE_PAYROLL)
      .exec();
  } catch (error) {
    throw error;
  }
};

const getBySeasonId = async (req: Request, res: Response) => {
  const seasonId = req.params.id;
  const today = new Date().setHours(0, 0, 0, 0);
  let totalHarvest = 0;
  let todaysHarvest = 0;
  let totalPayroll = 0;
  let totalDeductions = 0;
  let previousTotalHarvest = 0;
  let previousTotalPayroll = 0;
  let previousAverageHarvest = 0;

  try {
    const seasonData = await getSeasonData(seasonId);

    const harvestData = await getHarvestData(seasonId);

    const uniqueDaysSet = new Set();
    let createdAt;

    harvestData.forEach((harvestLog: any) => {
      if (harvestLog.createdAt > today) {
        todaysHarvest += harvestLog.collectedAmount;
      }

      totalHarvest += harvestLog.collectedAmount;

      createdAt = new Date(harvestLog.createdAt).setHours(0, 0, 0, 0);
      uniqueDaysSet.add(createdAt);
    });

    const harvestDays = uniqueDaysSet.size;

    const averageHarvest = totalHarvest / harvestDays;

    const payrollData = await getPayrollData(seasonId);
    payrollData.forEach((payroll: any) => {
      totalPayroll += payroll.totals.netAmount;
      totalDeductions += payroll.totals.deductions;
    });

    const averagePayroll = totalPayroll / harvestDays;

    const previousSeasonData = await getPreviousSeasonData(seasonData);

    const previousHarvestData =
      await getPreviousHarvestData(previousSeasonData);

    const previousUniqueDaysSet = new Set();
    let previousCreatedAt;

    previousHarvestData.forEach((harvestLog: any) => {
      previousTotalHarvest += harvestLog.collectedAmount;

      previousCreatedAt = new Date(harvestLog.createdAt).setHours(0, 0, 0, 0);
      previousUniqueDaysSet.add(previousCreatedAt);
    });
    const previousHarvestDays = previousUniqueDaysSet.size;
    previousAverageHarvest = previousTotalHarvest / previousHarvestDays;

    const previousPayrollData =
      await getPreviousPayrollData(previousSeasonData);
    previousPayrollData.forEach((payroll: any) => {
      previousTotalPayroll += payroll.totals.netAmount;
    });

    const previousAveragePayroll = previousTotalPayroll / previousHarvestDays;

    const recentPayrollData = await getRecentPayrollData(seasonData);
    const lastThreePayrolls = recentPayrollData.slice(0, 3);

    const payrollToTodayData = await getPayrollToTodayData({
      farmId: "65d703cf9a00b1a671609458", //TODO: replace with farmId from request
      seasonData: seasonData,
    });

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
        totalPayroll,
        totalDeductions,
      },
      averages: {
        averageHarvest,
        averagePayroll,
        previousAverageHarvest,
        previousAveragePayroll,
      },
      lastPayrolls: lastThreePayrolls,
      payrollToTodayData,
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
