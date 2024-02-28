import express from "express";
import harvestController from "../controllers/harvest-log.controllers";
import paths from '../shared/paths';
const harvestLogRouter = express.Router();

// POST: /api/v1/harvestlog
harvestLogRouter.post(paths.harvestLog, harvestController.create);

// GET: /api/v1/harvestlog
harvestLogRouter.get(paths.harvestLog, harvestController.getAll);

// GET: /api/v1/harvestlog/:id
harvestLogRouter.get(`${paths.harvestLog}/:id`, harvestController.getById);

export default harvestLogRouter;
