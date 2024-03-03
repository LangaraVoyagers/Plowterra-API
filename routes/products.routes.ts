import {
  createProduct,
  getAllProducts,
  getProduct,
  softDeleteProduct,
  updateProduct,
} from "../controllers/product.controllers";

import express from "express";
import paths from "../shared/paths";

const router = express.Router();

// POST: /api/v1/products
router.post(paths.products, createProduct);

// GET: /api/v1/products
router.get(paths.products, getAllProducts);

// GET: /api/v1/products/:id
router.get(`${paths.products}/:id`, getProduct);

// PUT: /api/v1/products/:id
router.put(`${paths.products}/:id`, updateProduct);

// SOFT DELETE: /api/v1/products/:id
router.delete(`${paths.products}/:id`, softDeleteProduct);

export default router;
