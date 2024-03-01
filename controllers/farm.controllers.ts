import { Request, Response } from "express";

import Farm from "../models/Farm";
import farmMessage from "../messages/farm.messages";

// create farm
async function create (req: Request, res: Response) {
  try {
    const farm = new Farm({
      name: req.body?.name,
      address: req.body?.address
    });

    const savedFarm = await farm.save();

    res.status(201).json({
      message: farmMessage.FARM_CREATE_SUCCESS,
      data: savedFarm,
      error: false
    });
    
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: farmMessage.FARM_CREATE_ERROR,
      data: null,
      error: true
    });
  }
}

// get all farms
async function getAll (req: Request, res: Response) {
  try {
    const farms = await Farm.find({}).populate("users").exec();
    
    // no farms exist
    if (!farms.length) {
      res.status(200).json({
        message: farmMessage.NOT_FOUND,
        data: null,
        error: false
      });

      return;
    }

    res.status(200).json({
      message: farmMessage.SUCCESS,
      data: farms,
      error: false
    });
    
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: farmMessage.ERROR,
      data: null,
      error: true
    });
  }
}

// get farm by Id
async function getById (req: Request, res: Response) {
  try {
    const farm = await Farm.findById(req.params?.id).populate("users").exec();
    
    // not found
    if (!farm) {
      res.status(200).json({
        message: farmMessage.NOT_FOUND,
        data: null,
        error: false
      });

      return;
    }

    res.status(200).json({
      message: farmMessage.SUCCESS,
      data: farm,
      error: false
    });
    
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: farmMessage.ERROR,
      data: null,
      error: true
    });
  }
}

// update farm
async function updateById (req: Request, res: Response) {
  try {
    const updatedFarm = await Farm.findByIdAndUpdate(
      { _id: req.params?.id },
      { name: req.body?.name, address: req.body?.address },
      { returnDocument: "after", runValidators: true }
    ).exec();

    res.status(200).json({
      message: farmMessage.FARM_UPDATE_SUCCESS,
      data: updatedFarm,
      error: false
    });
    
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: farmMessage.FARM_UPDATE_ERROR,
      data: null,
      error: true
    });
  }
}

// delete farm
async function deleteById (req: Request, res: Response) {
  try {
    const updatedFarm = await Farm.findByIdAndUpdate(
      { _id: req.params?.id },
      { isDisabled: true },
      { returnDocument: "after", runValidators: true }
    ).exec();

    res.status(200).json({
      message: farmMessage.FARM_DELETE_SUCCESS,
      data: updatedFarm,
      error: false
    });
    
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: farmMessage.FARM_DELETE_ERROR,
      data: null,
      error: true
    });
  }
}

const farmController = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};

export default farmController;
