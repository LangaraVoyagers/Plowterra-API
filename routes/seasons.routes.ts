import express from "express";
import seasonController from "../controllers/season.controllers";
import paths from "../shared/paths";

const seasonRouter = express.Router();

// GET: /api/v1/seasons
seasonRouter.get(paths.seasons, seasonController.getAll);

// GET: /api/v1/seasons/:id
seasonRouter.get(`${paths.seasons}/:id`, seasonController.getById);

// POST: /api/v1/seasons
seasonRouter.post(paths.seasons, seasonController.create);

// PUT: /api/v1/seasons/:id
seasonRouter.put(`${paths.seasons}/:id`, seasonController.update);

// SOFT DELETE: /api/v1/seasons/:id
seasonRouter.delete(`${paths.seasons}/:id`, seasonController.remove);

// PUT: /api/v1/seasons/:id/close
seasonRouter.put(`${paths.seasons}/:id/close`, seasonController.close);

export default seasonRouter;
