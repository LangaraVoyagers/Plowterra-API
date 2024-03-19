import { Request, Response } from "express";
import HarvestLog from "../models/HarvestLog";
import Payroll from "../models/Payroll";
import SeasonSchema from "../models/Season";
import Message from "../shared/Message";

const message = new Message("dashboard");

const POPULATE_SEASON = ["product", "unit", "currency", "endDate"];
const POPULATE_HARVEST_LOG = ["createdAt", "collectedAmount"];
const POPULATE_PAYROLL = ["totals"];

let season: any;
let harvestData: any;
let payrollData: any;
let allSeasonsData: any;
let previousSeasonData: any;

let totalHarvest = 0;
let harvestDays = 0;
let todaysHarvest = 0;
let previousDaysHarvest = 0;
let totalPayroll = 0;
let previousTotalPayroll = 0;
let totalDeductions = 0;

const getCurrentSeasonData = async (seasonId: any) => {
  try {
    season = await SeasonSchema.findOne({
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

const getPreviousSeasonData = async (seasonId: any) => {
  try {
    allSeasonsData = await SeasonSchema.find({
      deletedAt: null,
      product: season?.product,
      // status: "Closed",
    })
      .select("status startDate endDate product")
      .populate(POPULATE_SEASON);

    console.log("unsorted: " + allSeasonsData);

    //find the previous season compared to the current season, its endDate should be the closest to the current season's startDate
    allSeasonsData.sort((a: any, b: any) => {
      return a.endDate - b.endDate;
    });

    console.log("sorted: " + allSeasonsData);

    const currentSeasonIndex = allSeasonsData.findIndex(
      (season: any) => season._id === seasonId
    );

    console.log("current season index: " + currentSeasonIndex);

    if (currentSeasonIndex !== -1 && currentSeasonIndex > 0) {
      previousSeasonData = allSeasonsData[currentSeasonIndex - 1];
    } else {
      previousSeasonData = null;
    }

    console.log("previous season: " + previousSeasonData);

    // previousSeasonData = await SeasonSchema.findOne({
    //   _id: previousSeasonId,
    //   deletedAt: null,
    //   status: "ACTIVE",
    // }).populate(POPULATE_SEASON);
  } catch (error) {
    throw error;
  }
};

const getBySeasonId = async (req: Request, res: Response) => {
  const seasonId = req.params.id;

  try {
    await getCurrentSeasonData(seasonId);
    await getHarvestData(seasonId);
    await getPayrollData();
    await getPreviousSeasonData(seasonId);

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

    const data = {
      season: {
        id: season?._id,
        name: season?.name,
        startDate: season?.startDate,
        product: season?.product,
        unit: season?.unit,
        currency: season?.currency,
        price: season?.price,
        endDate: season?.endDate,
      },
      totals: {
        totalHarvest,
        harvestDays,
        todaysHarvest,
        previousDaysHarvest,
        totalPayroll,
        previousTotalPayroll,
        totalDeductions,
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
