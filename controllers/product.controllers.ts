import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Products';
import getContentLocation from "../shared/get-content-location";

export const createProduct = (req: Request, res: Response) => {
  const productData: IProduct = req.body;
  const product = new Product(productData);

  product.save()
    .then((product) => {
      const url = getContentLocation(req, product._id);
      res.set("content-location", url).status(201).json(product);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

export function getProduct(req: Request, res: Response) {
  Product.findById(req.params.id)
    .then((product) => {
      res.json(product);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

export function getAllProducts(req: Request, res: Response) {
  Product.find({ deletedAt: null })
    .then((activeProducts) => {
      res.json(activeProducts);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

export function updateProduct(req: Request, res: Response) {
  Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" })
    .then((updatedProduct) => {
      res.json(updatedProduct);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

export const softDeleteProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { deletedAt: Date.now(), deletedBy: "" },
      { returnDocument: "after" }
    );
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json(error);
  }
};
