import { ObjectId, Schema, model } from "mongoose";

import Deduction from "./Deduction";
import { IDeduction } from "../interfaces/deduction.interface";
import { IHarvestLog } from "../interfaces/harvestLog.interface";
import { ISeason } from "../interfaces/season.interface";
import Picker from "./Picker";
import SeasonSchema from "./Season";
import harvestLogMessage from "../messages/harvestLog.messages";

const HarvestLogSchema = new Schema({
  seasonId: { 
    type: String,
    required: [ true, harvestLogMessage.INVALID_SEASON_ID ],
    validate: {
      validator: (seasonId: string) => !!SeasonSchema.findById(seasonId),
      message: harvestLogMessage.INVALID_SEASON_ID
    } 
  },
  pickerId: { 
    type: String,
    required: [ true, harvestLogMessage.INVALID_PICKER_ID ],
    validate: {
      validator: (pickerId: string) => !!Picker.findById(pickerId),
      message: harvestLogMessage.INVALID_PICKER_ID
    } 
  },
  collectedAmount: { 
    type: Number,
    required: [ true, harvestLogMessage.COLLECTED_AMOUNT_GREATER_THAN_ZERO ],
    validate: {
      validator: (collectedAmount: number) => collectedAmount > 0,
      message: harvestLogMessage.COLLECTED_AMOUNT_GREATER_THAN_ZERO
    }
  },
  seasonDeductionIds: { 
    type: [String],
    validate: {
      validator: async function (seasonDeductionIds: Array<String>) {
        if (seasonDeductionIds.length > 0) {
          let i = 0;
          while (i < seasonDeductionIds.length) {
            const season = await SeasonSchema.findById((this as any).seasonId) as ISeason;
            if (!season.deductions.find(
              deduction => (deduction.deductionID as ObjectId)
              .toString() === seasonDeductionIds[i++])) 
              return false;
          }
          return true;
        }
        return true;
      },
      message: harvestLogMessage.INVALID_SEASON_DEDUCTION_ID
    },
    default: []
  },
  notes: { type: String }
}, { versionKey: false });


HarvestLogSchema.virtual("totalDeduction").get(async function () {
  let totalDeduction = 0;
  const season = await SeasonSchema.findById(this.seasonId) as ISeason;
  this.seasonDeductionIds.forEach(async (deductionId: string) => {
    const matchingDeduction = season.deductions.find((deductionObj) => (deductionObj.deductionID as ObjectId).toString() === deductionId);
    if (matchingDeduction) totalDeduction += matchingDeduction?.price;
  })

  return totalDeduction;
});

HarvestLogSchema.methods.getSeasonInfo = async function () {
  return await SeasonSchema.findById(this.seasonId);
}

const HarvestLog = model<IHarvestLog>("HarvestLog", HarvestLogSchema);

export default HarvestLog;
