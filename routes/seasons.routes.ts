import express from "express";
import seasonController from "../controllers/seasons.controllers";
import paths from "../shared/paths";

const seasonRouter = express.Router();

seasonRouter.get(paths.season, seasonController.getAll);
seasonRouter.get(`${paths.season}/:id`, seasonController.getById);
seasonRouter.post(paths.season, seasonController.create);
seasonRouter.put(`${paths.season}/:id`, seasonController.update);
seasonRouter.delete(`${paths.season}/:id`, seasonController.remove);
seasonRouter.put(`${paths.season}/:id/close`, seasonController.close);

export default seasonRouter;