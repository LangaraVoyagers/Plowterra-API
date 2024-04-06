import { Request, Response } from "express";

import farmMessage from "../messages/farm.messages";
import Farm from "../models/Farm";
import { FarmPayroll } from "../models/Payroll";

// create farm
async function create(req: Request, res: Response) {
  try {
    const farm = new Farm({
      name: req.body?.name,
      address: req.body?.address,
    });

    const savedFarm = await farm.save();

    res.status(201).json({
      message: farmMessage.FARM_CREATE_SUCCESS,
      data: savedFarm,
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: farmMessage.FARM_CREATE_ERROR,
      data: null,
      error: true,
    });
  }
}

// get all farms
async function getAll(req: Request, res: Response) {
  try {
    const farms = await Farm.find({})
      .populate({
        path: "users",
        model: "User",
        select: "-token",
      })
      .exec();

    // no farms exist
    if (!farms.length) {
      res.status(200).json({
        message: farmMessage.NOT_FOUND,
        data: null,
        error: false,
      });

      return;
    }

    res.status(200).json({
      message: farmMessage.SUCCESS,
      data: farms,
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: farmMessage.ERROR,
      data: null,
      error: true,
    });
  }
}

// get farm by Id
async function getById(req: Request, res: Response) {
  try {
    const farm = await Farm.findById(req.params?.id)
      .populate({
        path: "users",
        model: "User",
        select: "-token",
      })
      .exec();

    // not found
    if (!farm) {
      res.status(200).json({
        message: farmMessage.NOT_FOUND,
        data: null,
        error: false,
      });

      return;
    }

    res.status(200).json({
      message: farmMessage.SUCCESS,
      data: farm,
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: farmMessage.ERROR,
      data: null,
      error: true,
    });
  }
}

// update farm
async function updateById(req: Request, res: Response) {
  try {
    const updatedFarm = await Farm.findByIdAndUpdate(
      { _id: req.params?.id },
      {
        name: req.body?.name,
        address: req.body?.address,
        isDisabled: req.body?.isDisabled,
      },
      { returnDocument: "after", runValidators: true }
    ).exec();

    res.status(200).json({
      message: farmMessage.FARM_UPDATE_SUCCESS,
      data: updatedFarm,
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: farmMessage.FARM_UPDATE_ERROR,
      data: null,
      error: true,
    });
  }
}

// delete farm
async function deleteById(req: Request, res: Response) {
  try {
    const updatedFarm = await Farm.findByIdAndUpdate(
      { _id: req.params?.id },
      { isDisabled: true },
      { returnDocument: "after", runValidators: true }
    ).exec();

    res.status(200).json({
      message: farmMessage.FARM_DELETE_SUCCESS,
      data: updatedFarm,
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: farmMessage.FARM_DELETE_ERROR,
      data: null,
      error: true,
    });
  }
}

async function getLastPayrolls(req: Request, res: Response) {
  const farmId = req.params.id;
  const seasonId = req.query.seasonId ?? undefined;

  try {
    const data = await FarmPayroll.find({
      $and: [{ farm: farmId }, ...(seasonId ? [{ season: seasonId }] : [])],
    }).exec();

    res.status(200).json({
      message: `${data.length} record(s) found`,
      data,
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: farmMessage.ERROR,
      data: null,
      error: true,
    });
  }
}

const farmController = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
  getLastPayrolls,
};

export default farmController;
