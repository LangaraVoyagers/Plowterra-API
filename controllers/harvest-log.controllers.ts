import { Request, Response } from "express";

import HarvestLog from "../models/HarvestLog";
import { MongooseError } from "mongoose";
import { compareDates } from "../shared/date.helpers";
import harvestLogMessage from "../messages/harvest-log.messages";

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
    select: "-hasHarvestLog",
  },
  "picker",
  "seasonDeductions",
];

const create = async (req: Request, res: Response) => {
  try {
    // check if collectedAmount is a number
    if (isNaN(req.body?.collectedAmount)) {
      res.status(403).json({
        message: harvestLogMessage.COLLECTED_AMOUNT_NUMBER_ERROR,
        data: null,
        error: true,
      });

      return;
    }

    // create a new harvest log
    const harvestLog = new HarvestLog({
      season: req.body?.seasonId,
      picker: req.body?.pickerId,
      collectedAmount: Number(req.body?.collectedAmount),
      seasonDeductions: req.body?.seasonDeductionIds,
      notes: req.body?.notes,
      createdBy: res.locals.user?.name,
      createdAt: req.body?.createdAt, // For testing, we shoudn't send the date on the frontend
    });

    // save the log and populate fields
    const savedHarvestLog = await (
      await harvestLog.save()
    ).populate(populateQuery);

    // return the response
    res.status(201).json({
      message: harvestLogMessage.HARVEST_LOG_CREATE_SUCCESS,
      data: savedHarvestLog,
      error: false,
    });
  } catch (error) {
    // if there are any validation errors
    if ((error as any).name === "ValidationError") {
      res.status(403).json({
        message: (Object.values((error as any).errors)[0] as MongooseError)
          .message,
        data: null,
        error: true,
      });

      return;
    }

    // error's other than validation
    console.error(error);

    res.status(500).json({
      message: harvestLogMessage.HARVEST_LOG_CREATE_ERROR,
      data: null,
      error: true,
    });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    // 14 * 24 * 60 * 60 * 1000
    const TWO_WEEKS = 1209600000;
    
    const settled = req.query.settled ?? undefined;
    const seasonId = req.query.seasonId ?? undefined;
    const pickerId = req.query.pickerId ?? undefined;
    const fromDate = req.query.fromDate ?? new Date(new Date().toLocaleDateString()).getTime() - TWO_WEEKS;
    const toDate = req.query.toDate ?? new Date().getTime();

    const harvestLogs = await HarvestLog.find({
      $and: [
        { createdAt: { 
          $gte: fromDate,
          $lte: toDate
        }},
        { deletedAt: null },
        ...(settled ? [{ settled }] : []),
        ...(seasonId ? [{ season: seasonId }] : []),
        ...(pickerId ? [{ picker: pickerId }] : []),
      ],
    })
      .sort({ createdAt: "desc" })
      .select("+createdAt")
      .populate(populateQuery)
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
      message: `${harvestLogs.length} records found`,
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

const getById = async (req: Request, res: Response) => {
  try {
    const harvestLog = await HarvestLog.findOne({
      _id: req.params?.id,
      deletedAt: null,
    })
      .select("+createdAt")
      .populate(populateQuery)
      .exec();

    // harvest log doesnot exist
    if (!harvestLog) {
      res.status(404).json({
        message: harvestLogMessage.NOT_FOUND,
        data: null,
        error: false,
      });

      return;
    }

    res.status(200).json({
      message: harvestLogMessage.SUCCESS,
      data: harvestLog,
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

const updateById = async (req: Request, res: Response) => {
  try {
    const harvestLog = await HarvestLog.findOne({
      _id: req.params?.id,
      deletedAt: null,
    })
      .populate(populateQuery)
      .select("+createdAt")
      .exec();

    // harvest log doesnot exist
    if (!harvestLog) {
      res.status(404).json({
        message: harvestLogMessage.NOT_FOUND,
        data: null,
        error: false,
      });

      return;
    }

    const { days } = compareDates(new Date().getTime(), harvestLog!.createdAt);

    // check if a day has passed since the harvest log was created
    if (days > 0) {
      res.status(403).json({
        message: harvestLogMessage.HARVEST_LOG_UDATE_PASSED_DATE,
        data: null,
        error: true,
      });

      return;
    }

    // check if collectedAmount is a number
    if (isNaN(req.body?.collectedAmount)) {
      res.status(403).json({
        message: harvestLogMessage.COLLECTED_AMOUNT_NUMBER_ERROR,
        data: null,
        error: true,
      });

      return;
    }

    // update harvest log
    const updatedHarvestLog = await HarvestLog.findByIdAndUpdate(
      req.params?.id,
      {
        collectedAmount: Number(req.body?.collectedAmount),
        seasonDeductions: req.body?.seasonDeductionIds,
        notes: req.body?.notes,
        updatedBy: res.locals.user?.name,
        updatedAt: new Date().getTime(),
      },
      { returnDocument: "after", runValidators: true }
    )
      .populate(populateQuery)
      .select("+createdAt")
      .exec();

    res.status(200).json({
      message: harvestLogMessage.HARVEST_LOG_UPDATE_SUCCESS,
      data: updatedHarvestLog,
      error: false,
    });
  } catch (error) {
    // if there are any validation errors
    if ((error as any).name === "ValidationError") {
      res.status(403).json({
        message: (Object.values((error as any).errors)[0] as MongooseError)
          .message,
        data: null,
        error: true,
      });

      return;
    }

    // error's other than validation
    console.error(error);

    res.status(500).json({
      message: harvestLogMessage.HARVEST_LOG_UPDATE_ERROR,
      data: null,
      error: true,
    });
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const harvestLog = await HarvestLog.findOne({
      _id: req.params?.id,
      deletedAt: null,
    })
      .populate(populateQuery)
      .select("+createdAt")
      .exec();

    // harvest log doesnot exist
    if (!harvestLog) {
      res.status(404).json({
        message: harvestLogMessage.NOT_FOUND,
        data: null,
        error: false,
      });

      return;
    }

    const { days } = compareDates(new Date().getTime(), harvestLog!.createdAt);

    // check if a day has passed since the harvest log was created
    if (days > 0) {
      res.status(403).json({
        message: harvestLogMessage.HARVEST_LOG_DELETE_PASSED_DATE,
        data: null,
        error: true,
      });

      return;
    }

    // update harvest log and set the deletedAt, deletedBy field
    const updatedHarvestLog = await HarvestLog.findByIdAndUpdate(
      req.params?.id,
      {
        deletedAt: new Date().getTime(),
        deletedBy: res.locals.user?.name,
      },
      { returnDocument: "after", runValidators: true }
    )
      .populate(populateQuery)
      .exec();

    res.status(200).json({
      message: harvestLogMessage.HARVEST_LOG_DELETE_SUCCESS,
      data: updatedHarvestLog,
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: harvestLogMessage.HARVEST_LOG_DELETE_ERROR,
      data: null,
      error: true,
    });
  }
};

const harvestLogController = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};

export default harvestLogController;
