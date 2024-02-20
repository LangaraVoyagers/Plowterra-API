import express from "express";

import payrollRouter from "./payrolls.routes";
import deductionsRouter from "./deductions.routes";
import productsRouter from "./products.routes";

const router = express.Router({ mergeParams: true });

// const pickerRouter = require("./pickers.routes");
// router.use(pickerRouter);

// const harvestLogRouter = require("./harvest-logs.routes");
// router.use(harvestLogRouter);

// const seasonRouter = require("./seasons.routes");
// router.use(seasonRouter);

// const deductionRouter = require("./deductions.routes");
// router.use(deductionRouter);
router.use(payrollRouter);
router.use(deductionsRouter);
router.use(productsRouter);

export default router;
