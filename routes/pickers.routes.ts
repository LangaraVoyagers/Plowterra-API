import express from "express";
import {
  createPicker,
  getAllPickers,
  getPicker,
  softDeletePicker,
  updatePicker,
} from "../controllers/picker.controllers";
import paths from "../shared/paths";

const router = express.Router();

// POST: /api/v1/pickers
router.post(paths.picker, createPicker);

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
