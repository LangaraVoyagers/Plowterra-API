import express from "express";
import farmController from "../controllers/farm.controllers";
import paths from "../shared/paths";

const farmRouter = express.Router();

// POST: /api/v1/farms
farmRouter.post(`${paths.farm}`, farmController.create);

// GET: /api/v1/farms
farmRouter.get(paths.farm, farmController.getAll);

// GET: /api/v1/farms/:id
farmRouter.get(`${paths.farm}/:id`, farmController.getById);

// PUT: /api/v1/farms/:id
farmRouter.put(`${paths.farm}/:id`, farmController.updateById);

// DELETE: /api/v1/farms/:id
farmRouter.delete(`${paths.farm}/:id`, farmController.deleteById);

export default farmRouter;
