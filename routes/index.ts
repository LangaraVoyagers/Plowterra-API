import express from "express";

import payrollRouter from "./payrolls.routes";
import seasonRouter from "./seasons.routes";
import deductionsRouter from "./deductions.routes";
import productsRouter from "./products.routes";
import pickersRouter from "./pickers.routes";

const router = express.Router({ mergeParams: true });

router.use(payrollRouter);
router.use(seasonRouter);
router.use(deductionsRouter);
router.use(productsRouter);
router.use(pickersRouter);

export default router;
