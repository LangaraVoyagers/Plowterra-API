import { Request, Response } from 'express';
import Picker, { IPicker } from '../models/Picker';

export function createPicker(req: Request, res: Response) {
    const pickerData: IPicker = req.body;
    const picker = new Picker(pickerData);
  
    picker.save()
      .then((createdPicker) => {
        res.status(201).json(createdPicker);
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  }

export function getPicker(req: Request, res: Response) {
  Picker.findById(req.params.id)
    .then((picker) => {
      if (!picker) {
        return res.status(404).json({ error: 'Picker not found' });
      }
      res.json(picker);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export function getAllPickers(req: Request, res: Response) {
  Picker.find({ deletedAt: null })
    .then((activePickers) => {
      res.json(activePickers);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}

export function updatePicker(req: Request, res: Response) {
    Picker.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((updatedPicker) => {
        if (!updatedPicker) {
          return res.status(404).json({ error: 'Picker not found' });
        }
        res.status(200).json({
          message: "Picker updated",
          data: updatedPicker,
          error: null,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Error updating picker",
          data: null,
          error,
        });
      });
  };

export function softDeletePicker(req: Request, res: Response) {
  Picker.findByIdAndUpdate(req.params.id, { deletedAt: Date.now() })
    .then((updatedPicker) => {
      if (!updatedPicker) {
        return res.status(404).json({ error: 'Picker not found' });
      }
      res.json({ message: 'Picker deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};