import express from "express";
import harvestController from "../controllers/harvest-log.controllers";
import paths from "../shared/paths";

const harvestLogRouter = express.Router();

// POST: /api/v1/harvest-logs:id
harvestLogRouter.post(
  [paths.harvestLog, `${paths.harvestLog}/:id`],
  // TODO: make changes to validation
  // harvestLogValidator(HarvestLogSchema),
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
