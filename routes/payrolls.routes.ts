import express from "express";
import payrollController from "../controllers/payroll.controllers";
import paths from "../shared/paths";

const payrollRouter = express.Router();

payrollRouter.get(paths.payroll, payrollController.getAll);

payrollRouter.get(`${paths.payroll}/:id`, payrollController.getById);


export default payrollRouter;
