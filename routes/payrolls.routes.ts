import express from "express";
import payrollController from "../controllers/payroll.controllers";
import paths from "../shared/paths";

const payrollRouter = express.Router();

// GET: /api/v1/payrolls
payrollRouter.get(paths.payroll, payrollController.getAll);

// POST: /api/v1/payrolls/preview
payrollRouter.post(`${paths.payroll}/preview`, payrollController.getPreview);

// GET: /api/v1/payrolls/:id
payrollRouter.get(`${paths.payroll}/:id`, payrollController.getById);

// POST: /api/v1/payrolls
payrollRouter.post(paths.payroll, payrollController.create);


export default payrollRouter;
