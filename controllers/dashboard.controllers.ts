import { Request, Response } from "express";
import harvestLogMessage from "../messages/harvest-log.messages";
import HarvestLog from "../models/HarvestLog";

const populateQuery = [
  {
    path: "season",
    model: "Season",
    populate: [
      {
        path: "product",
        model: "Product",
      },
      {
        path: "unit",
        model: "Unit",
      },
      {
        path: "currency",
        model: "Currency",
      },
    ],
  },
  "picker",
  "seasonDeductions",
  {
    path: "correctionLogs",
    model: "HarvestLog",
    populate: [
      {
        path: "season",
        model: "Season",
      },
    ],
    select: ["-correctionLogs", "+createdAt"],
  },
];

const getBySeasonId = async (req: Request, res: Response) => {
  try {
    const harvestLogs = await HarvestLog.find({
      season: req.params?.id,
      deletedAt: null,
      parentId: null,
    })
      .populate(populateQuery)
      .select("+createdAt")
      .exec();

    // no records
    if (!harvestLogs.length) {
      res.status(200).json({
        message: harvestLogMessage.NOT_FOUND,
        data: null,
        error: false,
      });

      return;
    }

    res.status(200).json({
      message: `${harvestLogs.length} record${harvestLogs.length > 1 ? "s" : ""} found`,
      data: harvestLogs,
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: harvestLogMessage.ERROR,
      data: null,
      error: true,
    });
  }
};

const dashboardController = {
  getBySeasonId,
};

export default dashboardController;
