import express from "express";
import deductionController from "../controllers/deduction.controllers";
import paths from "../shared/paths";

const router = express.Router();

router.get(paths.deduction, deductionController.getAll);

router.get(`${paths.deduction}/:id`, deductionController.getById);

router.post(paths.deduction, deductionController.create);

router.delete(`${paths.deduction}/:id`, deductionController.remove);

export default router;
