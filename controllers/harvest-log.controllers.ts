import { Request, Response } from "express";

import HarvestLog from "../models/HarvestLog";
import { MongooseError } from "mongoose";
import harvestLogMessage from "../messages/harvestLog.messages";

const create = async (req: Request, res: Response) => {
  try {
    if (isNaN(req.body?.collectedAmount)) {
      res.json({
        message: harvestLogMessage.COLLECTED_AMOUNT_NUMBER_ERROR,
        data: null,
        error: true,
      });

      return;
    }

    const harvestLog = new HarvestLog({
      season: req.body?.seasonId,
      picker: req.body?.pickerId,
      collectedAmount: Number(req.body?.collectedAmount),
      seasonDeductions: req.body?.seasonDeductionIds,
      notes: req.body?.notes,
    });

    const savedHarvestLog = await harvestLog.save();

    const data = await HarvestLog.findById(savedHarvestLog.id)
      .populate({
        path: "season",
        model: "Season",
        populate: [
          {
            path: "product",
            model: "Product",
          },
        ],
      })
      .populate("picker seasonDeductions")
      .exec();

    res.json({
      message: harvestLogMessage.HARVEST_LOG_CREATE_SUCCESS,
      data: data,
      error: false,
    });
  } catch (error) {
    if ((error as any).name === "ValidationError") {
      res.status(403).json({
        message: (Object.values((error as any).errors)[0] as MongooseError)
          .message,
        data: null,
        error: true,
      });

      return;
    }

    res.status(500).json({
      message: harvestLogMessage.HARVEST_LOG_CREATE_ERROR,
      data: null,
      error: true,
    });
  }
};

const getAll = async (req: Request, res: Response) => {
  const harvestLogs = await HarvestLog.find({
    deletedAt: null,
  })

    .sort({ createdAt: "desc" })
    .populate("picker seasonDeductions")
    .populate({
      path: "season",
      model: "Season",
      populate: [
        {
          path: "product",
          model: "Product",
        },
      ],
    })
    .select("+createdAt")

    .exec();

  res.json({
    data: harvestLogs,
    error: false,
  });
};

const getById = async (req: Request, res: Response) => {
  const harvestLogs = await HarvestLog.findOne({
    _id: req.params.id,
    deletedAt: null,
  })
    .populate("picker seasonDeductions")
    .populate({
      path: "season",
      model: "Season",
      populate: [
        {
          path: "product",
          model: "Product",
        },
      ],
    })
    .exec();

  res.json({
    data: harvestLogs,
    error: false,
  });
};

const harvestLogController = {
  create,
  getAll,
  getById,
};

export default harvestLogController;
