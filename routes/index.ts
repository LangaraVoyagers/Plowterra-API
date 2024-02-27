import authenticationRouter from "./authentication.routes";
import deductionsRouter from "./deductions.routes";
import express from "express";
import harvestLogRouter from "./harvest-logs.routes";
import payrollRouter from "./payrolls.routes";
import pickersRouter from "./pickers.routes";
import productsRouter from "./products.routes";
import seasonRouter from "./seasons.routes";

const router = express.Router({ mergeParams: true });

router.use(authenticationRouter)
router.use(deductionsRouter);
router.use(harvestLogRouter)
router.use(payrollRouter);
router.use(productsRouter);
router.use(pickersRouter);
router.use(seasonRouter);

export default router;
