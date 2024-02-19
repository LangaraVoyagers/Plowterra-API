import express from 'express';
import { createProduct, getProduct, getAllProducts, updateProduct, softDeleteProduct } from '../controllers/product.controllers';

const router = express.Router();

// POST: /api/v1/products
router.post('/products', createProduct);

// GET: /api/v1/products
router.get('/products', getAllProducts);

// GET: /api/v1/products/:id
router.get('/products/:id', getProduct);

// PUT: /api/v1/products/:id
router.put('/products/:id', updateProduct);

// SOFT DELETE: /api/v1/products/:id
router.patch('/products/:id', softDeleteProduct);

export default router;
