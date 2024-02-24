import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Products';
import getContentLocation from "../shared/get-content-location";
import Message from "../shared/Message";

const message = new Message("picker");

export const createProduct = (req: Request, res: Response) => {
  const productData: IProduct = req.body;
  const product = new Product(productData);

  product
    .save()
    .then((data) => {
      const url = getContentLocation(req, data._id);

      res
        .set("content-location", url)
        .status(201)
        .json({
          data,
          error: false,
          message: message.create("success"),
        });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.create("error"),
      });
    });
};

export function getProduct(req: Request, res: Response) {
  Product.findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ data, error: true, message: message.get("not_found") });
      }

      res
        .status(200)
        .json({ data, error: false, message: message.get("success") });
    })
    .catch(() => {
      res
        .status(500)
        .json({ data: null, error: true, message: message.get("error") });
    });
}

export function getAllProducts(req: Request, res: Response) {
  Product.find({ deletedAt: null })
    .then((data) => {
      res.status(200).json({
        data,
        error: false,
        message: message.get("success"),
      });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.get("error"),
      });
    });
}

export function updateProduct(req: Request, res: Response) {
  const id = req?.params?.id;

  Product.findOneAndUpdate({ _id: id, deletedAt: null }, req.body, {
    returnDocument: "after",
  })
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ data, error: true, message: message.get("not_found") });
      }

      res.status(200).json({
        data,
        error: false,
        message: message.update("success"),
      });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.update("error"),
      });
    });
}

export function softDeleteProduct(req: Request, res: Response) {
  const id = req?.params?.id;

  Product.findOneAndUpdate(
    { _id: id, deletedAt: null },
    {
      deletedAt: new Date().getTime(),
      deletedBy: "",
    },
    {
      returnDocument: "after",
    }
  )
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ data, error: true, message: message.get("not_found") });
      }

      res.status(200).json({
        data,
        error: false,
        message: message.delete("success"),
      });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.delete("error"),
      });
    });
}
