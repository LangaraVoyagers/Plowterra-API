import express from "express";
import payrollController from "../controllers/payroll.controllers";
import paths from "../shared/paths";

const payrollRouter = express.Router();

// GET: /api/v1/harvest-logs
payrollRouter.get(paths.payroll, payrollController.getAll);

// GET: /api/v1/harvest-logs/:id
payrollRouter.get(`${paths.payroll}/:id`, payrollController.getById);

// POST: /api/v1/harvest-logs
payrollRouter.post(paths.payroll, payrollController.create);


export default payrollRouter;
