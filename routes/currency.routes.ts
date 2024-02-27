import express from "express";
import currencyController from "../controllers/currency.controllers";
import paths from "../shared/paths";

const router = express.Router();

router.get(paths.currency, currencyController.getAll);

router.get(`${paths.currency}/:id`, currencyController.getById);

router.post(paths.currency, currencyController.create);

router.delete(`${paths.currency}/:id`, currencyController.remove);

export default router;