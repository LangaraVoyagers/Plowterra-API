import express from "express";
import harvestController from "../controllers/harvestLog.controllers";
import paths from '../shared/paths';
const harvestLogRouter = express.Router();

// POST: /api/v1/harvest-log
harvestLogRouter.post(paths.harvestLog, harvestController.create);

// GET: /api/v1/harvest-log
harvestLogRouter.get(paths.harvestLog, harvestController.getAll);

export default harvestLogRouter;
