import { Request, Response } from "express";
import Picker, { IPicker } from "../models/Picker";
import Message from "../shared/Message";
import getContentLocation from "../shared/get-content-location";

const message = new Message("picker");

export function createPicker(req: Request, res: Response) {
  const pickerData: IPicker = req.body;
  const picker = new Picker(pickerData);

  picker
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
}

export function getPicker(req: Request, res: Response) {
  Picker.findById(req.params.id)
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

export function getAllPickers(req: Request, res: Response) {
  Picker.find({ deletedAt: null })
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

export function updatePicker(req: Request, res: Response) {
  const id = req?.params?.id;

  Picker.findOneAndUpdate({ _id: id, deletedAt: null }, req.body, {
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

export function softDeletePicker(req: Request, res: Response) {
  const id = req?.params?.id;

  Picker.findOneAndUpdate(
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
