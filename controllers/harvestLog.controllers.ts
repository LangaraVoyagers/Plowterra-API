import { Request, Response } from "express";

import HarvestLog from "../models/HarvestLog";
import { IHarvestLog } from "../interfaces/harvestLog.interface";
import { MongooseError } from "mongoose";
import harvestLogMessage from "../messages/harvestLog.messages";

const create = async (req: Request, res: Response) => {
  try {

    if (isNaN(req.body?.collectedAmount)) {
      res.json({
        message: harvestLogMessage.COLLECTED_AMOUNT_NUMBER_ERROR,
        data: null,
        error: true
      });

      return;
    }

    const harvestLog = new HarvestLog<IHarvestLog>({
      seasonId: req.body?.seasonId,
      pickerId: req.body?.pickerId,
      collectedAmount: Number(req.body?.collectedAmount),
      seasonDeductionIds: req.body?.seasonDeductionIds,
      notes: req.body?.notes
    });

    const savedHarvestLog = await harvestLog.save();

    // await savedHarvestLog.totalDeduction;

    res.json({
      message: harvestLogMessage.HARVEST_LOG_CREATE_SUCCESS,
      data: savedHarvestLog,
      error: false
    })
    
  } catch (error) {
    if ((error as any).name === "ValidationError") {
      res.status(403).json({
        message: (Object.values((error as any).errors)[0] as MongooseError).message,
        data: null,
        error: true,
      });

      return;
    }

    console.log(error);
    
    res.status(500).json({
      message: harvestLogMessage.HARVEST_LOG_CREATE_ERROR,
      data: null,
      error: true
    });
  }
};

const getAll = async (req: Request, res: Response) => {
  const harvestLogs = await HarvestLog.find({}).exec();

  res.json({
    data: harvestLogs,
    error: false
  })
};

const harvestLogController = {
  create,
  getAll
};

export default harvestLogController;
