import express from 'express';
import { createPicker, getPicker, getAllPickers, updatePicker, softDeletePicker } from '../controllers/picker.controllers';

const router = express.Router();

// POST: /api/v1/pickers
router.post('/pickers', createPicker);

// GET: /api/v1/pickers
router.get('/pickers', getAllPickers);

// GET: /api/v1/pickers/:id
router.get('/pickers/:id', getPicker);

// PUT: /api/v1/pickers/:id
router.put('/pickers/:id', updatePicker);

//SOFT DELETE: /api/v1/pickers/:id
router.patch('/pickers/:id', softDeletePicker);

export default router;
