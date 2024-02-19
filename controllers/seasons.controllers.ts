import { NextFunction, Response, Request } from "express"
import Season from "../models/Season"

function create() {}

function getAll(req: Request, res: Response, next: NextFunction) {
  Season.find({})
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

function getById(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findOne({ _id: id })
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

function close() {} //close season

function update() {} //overrride whats on the list

function remove() {} //Ff there is a harvest log, cant delete. Enter name to delete

const seasonController = {
  create,
  getAll,
  getById,
  close,
  update,
  remove,
};

export default seasonController;