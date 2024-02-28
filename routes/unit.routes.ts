import express from "express";
import unitController from "../controllers/unit.controllers"; // Importa el controlador de unidades
import paths from "../shared/paths";

const router = express.Router();

router.get(paths.unit, unitController.getAll); // Utiliza el controlador de unidades para las rutas relacionadas con unidades

router.get(`${paths.unit}/:id`, unitController.getById);

router.post(paths.unit, unitController.create);

router.delete(`${paths.unit}/:id`, unitController.remove);

export default router;


