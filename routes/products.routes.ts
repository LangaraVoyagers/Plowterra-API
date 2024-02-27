import { createProduct, getAllProducts, getProduct, softDeleteProduct, updateProduct } from '../controllers/product.controllers';

import express from 'express';
import paths from '../shared/paths';

const router = express.Router();

// POST: /api/v1/products
router.post(paths.product, createProduct);

// GET: /api/v1/products
router.get(paths.product, getAllProducts);

// GET: /api/v1/products/:id
router.get( `${paths.product}/:id`, getProduct);

// PUT: /api/v1/products/:id
router.put(`${paths.product}/:id`, updateProduct);

// SOFT DELETE: /api/v1/products/:id
router.delete(`${paths.product}/:id`, softDeleteProduct);

export default router;
