import authenticationRouter from "./authentication.routes";
import deductionsRouter from "./deductions.routes";
import express from "express";
import payrollRouter from "./payrolls.routes";
import pickersRouter from "./pickers.routes";
import productsRouter from "./products.routes";
import seasonRouter from "./seasons.routes";
import unitRouter from "./unit.routes";
import currencyRouter from "./currency.routes";

const router = express.Router({ mergeParams: true });

router.use(authenticationRouter)
router.use(deductionsRouter);
router.use(payrollRouter);
router.use(seasonRouter);
router.use(deductionsRouter);
router.use(productsRouter);
router.use(pickersRouter);
router.use(unitRouter);
router.use(currencyRouter);

export default router;
