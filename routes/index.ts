import express from "express";
import payrollRouter from "./payrolls.routes";

import deductionsRouter from "./deductions.routes";

const router = express.Router({ mergeParams: true });

// const pickerRouter = require("./pickers.routes");
// router.use(pickerRouter);

// const harvestLogRouter = require("./harvest-logs.routes");
// router.use(harvestLogRouter);

// const seasonRouter = require("./seasons.routes");
// router.use(seasonRouter);

// const productRouter = require("./products.routes");
// router.use(productRouter);

// const deductionRouter = require("./deductions.routes");
// router.use(deductionRouter);
router.use(deductionsRouter);

router.use(payrollRouter);

export default router;
