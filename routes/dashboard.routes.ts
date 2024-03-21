import express from "express";
import harvestController from "../controllers/dashboard.controllers";
import paths from "../shared/paths";

const dashboardRouter = express.Router();

// GET: /api/v1/indicators/season/:id
dashboardRouter.get(`${paths.dashboard}/:id`, harvestController.getBySeasonId);

export default dashboardRouter;
