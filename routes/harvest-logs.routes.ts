import express from "express";
import HarvestLogSchema from "project-2-types/dist/ajv/harvest-log.ajv";
import harvestController from "../controllers/harvest-log.controllers";
import paths from "../shared/paths";
import harvestLogValidator from "../shared/validators";

const harvestLogRouter = express.Router();

// POST: /api/v1/harvest-logs
harvestLogRouter.post(
  paths.harvestLog,
  harvestLogValidator(HarvestLogSchema),
  harvestController.create
);

// GET: /api/v1/harvest-logs
harvestLogRouter.get(paths.harvestLog, harvestController.getAll);

// GET: /api/v1/harvest-logs/:id
harvestLogRouter.get(`${paths.harvestLog}/:id`, harvestController.getById);

// PUT: /api/v1/harvest-logs/:id
harvestLogRouter.put(`${paths.harvestLog}/:id`, harvestController.updateById);

// DELETE: /api/v1/harvest-logs/:id
harvestLogRouter.delete(
  `${paths.harvestLog}/:id`,
  harvestController.deleteById
);

export default harvestLogRouter;
