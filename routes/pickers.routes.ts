import express from "express";
import schema from "project-2-types/lib/pickers.ajv";
import {
  createPicker,
  getAllPickers,
  getPicker,
  softDeletePicker,
  updatePicker,
} from "../controllers/picker.controllers";
import paths from "../shared/paths";
import validator from "../shared/validators";

const router = express.Router();

// POST: /api/v1/pickers
router.post(paths.picker, validator(schema), createPicker);

// GET: /api/v1/pickers
router.get(paths.picker, getAllPickers);

// GET: /api/v1/pickers/:id
router.get(`${paths.picker}/:id`, getPicker);

// PUT: /api/v1/pickers/:id
router.put(`${paths.picker}/:id`, updatePicker);

//SOFT DELETE: /api/v1/pickers/:id
router.delete(`${paths.picker}/:id`, softDeletePicker);

// module.exports = router;
export default router;
