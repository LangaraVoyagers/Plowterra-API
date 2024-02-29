import express from "express";
import paths from "../shared/paths";
import { createUnit, getAllUnit, getUnit, deleteUnit } from "../controllers/unit.controllers";

const router = express.Router()

// POST: /api/v1/units
router.post(paths.unit, createUnit);

// GET: /api/v1/units
router.get(paths.unit, getAllUnit);

// GET: /api/v1/units/:id
router.get(`${paths.unit}/:id`, getUnit);

// DELETE: /api/v1/units/:id
router.delete(`${paths.unit}/:id`, deleteUnit);

export default router;


