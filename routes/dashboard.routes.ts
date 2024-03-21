import express from "express";
import harvestController from "../controllers/dashboard.controllers";
import paths from "../shared/paths";

const dashboardRouter = express.Router();

// GET: /api/v1/dashboard/indicators/:id
dashboardRouter.get(
  `${paths.dashboard}/indicators/:id`,
  harvestController.getIndicatorsBySId
);

// GET: /api/v1/dashboard/harvest-graph/:id
dashboardRouter.get(
  `${paths.dashboard}/harvest-graph/:id`,
  harvestController.getHarvestGraphBySId
);

export default dashboardRouter;
