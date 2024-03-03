import express from "express";
import authenticationRouter from "./authentication.routes";
import currencyRouter from "./currency.routes";
import deductionsRouter from "./deductions.routes";
import harvestLogRouter from "./harvest-logs.routes";
import payrollRouter from "./payrolls.routes";
import pickersRouter from "./pickers.routes";
import productsRouter from "./products.routes";
import seasonRouter from "./seasons.routes";
import unitRouter from "./unit.routes";

const router = express.Router({ mergeParams: true });

router.use(authenticationRouter);
router.use(deductionsRouter);
router.use(harvestLogRouter);
router.use(payrollRouter);
router.use(productsRouter);
router.use(pickersRouter);
router.use(unitRouter);
router.use(seasonRouter);
router.use(currencyRouter);

export default router;
