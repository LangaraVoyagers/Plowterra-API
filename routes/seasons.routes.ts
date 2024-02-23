import express from "express";
import seasonController from "../controllers/seasons.controllers";
import paths from "../shared/paths";

const seasonRouter = express.Router();

// GET: /api/v1/seasons
seasonRouter.get(paths.season, seasonController.getAll);

// GET: /api/v1/seasons/:id
seasonRouter.get(`${paths.season}/:id`, seasonController.getById);

// POST: /api/v1/seasons
seasonRouter.post(paths.season, seasonController.create);

// PUT: /api/v1/seasons/:id
seasonRouter.put(`${paths.season}/:id`, seasonController.update);

// SOFT DELETE: /api/v1/seasons/:id
seasonRouter.delete(`${paths.season}/:id`, seasonController.remove);

// PUT: /api/v1/seasons/:id/close
seasonRouter.put(`${paths.season}/:id/close`, seasonController.close);

export default seasonRouter;
