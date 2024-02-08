import express from "express";
const router = express.Router();

const pickerRouter = require("./pickers.routes");
router.use(pickerRouter);

const harvestLogRouter = require("./harvest-logs.routes");
router.use(harvestLogRouter);

const seasonRouter = require("./seasons.routes");
router.use(seasonRouter);

const productRouter = require("./products.routes");
router.use(productRouter);

const deductionRouter = require("./deductions.routes");
router.use(deductionRouter);

const payrollRouter = require("./payrolls.routes");
router.use(payrollRouter);

module.exports = router;
