import express from "express";
import unitController from "../controllers/unit.controllers"; 
import paths from "../shared/paths";

const router = express.Router()

// POST: /api/v1/units
router.post(paths.unit, unitController.create);

// GET: /api/v1/units
router.get(paths.unit, unitController.getAll);

// GET: /api/v1/units/:id
router.get(`${paths.unit}/:id`, unitController.getById);

// DELETE: /api/v1/units/:id
router.delete(`${paths.unit}/:id`, unitController.remove);

export default router;


