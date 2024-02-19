import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Products';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const productData: IProduct = req.body;
        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const activeProducts = await Product.find({ deletedAt: null });
        res.json(activeProducts);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const softDeleteProduct = async (req: Request, res: Response) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { deletedAt: Date.now() });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
