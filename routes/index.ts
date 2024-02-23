import authenticationRouter from "./authentication.routes";
import deductionsRouter from "./deductions.routes";
import express from "express";
import payrollRouter from "./payrolls.routes";
import seasonRouter from "./seasons.routes";

const router = express.Router({ mergeParams: true });

// const pickerRouter = require("./pickers.routes");
// router.use(pickerRouter);

// const harvestLogRouter = require("./harvest-logs.routes");
// router.use(harvestLogRouter);

// const productRouter = require("./products.routes");
// router.use(productRouter);

// const deductionRouter = require("./deductions.routes");
// router.use(deductionRouter);
router.use(authenticationRouter)
router.use(deductionsRouter);

router.use(payrollRouter);
router.use(seasonRouter);

export default router;
