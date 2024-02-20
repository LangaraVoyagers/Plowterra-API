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
        res.status(500).json({ error: error.message });
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
      res.status(500).json({ error: error.message });
    });
};

export function getAllPickers(req: Request, res: Response) {
  Picker.find({ deletedAt: null })
    .then((activePickers) => {
      res.json(activePickers);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
}

export const updatePicker = async (req: Request, res: Response) => {
    try {
        const updatedPicker = await Picker.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPicker) {
            return res.status(404).json({ error: 'Picker not found' });
        }
        res.json(updatedPicker);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const softDeletePicker = async (req: Request, res: Response) => {
    try {
        const updatedPicker = await Picker.findByIdAndUpdate(req.params.id, { deletedAt: Date.now() });
        if (!updatedPicker) {
            return res.status(404).json({ error: 'Picker not found' });
        }
        res.json({ message: 'Picker deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
