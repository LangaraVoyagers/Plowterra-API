import { Schema, model } from "mongoose";

import { AuditSchema } from "./Audit";
import { IHarvestLogSchema } from "../interfaces/harvest-log.interface";
import { ISeasonSchema } from "../interfaces/season.interface";
import Picker from "./Picker";
import SeasonSchema from "./Season";
import harvestLogMessage from "../messages/harvestLog.messages";

const HarvestLogSchema = new Schema<IHarvestLogSchema>({
  season: {
    type: Schema.Types.ObjectId,
    ref: "Season",
    required: [true, harvestLogMessage.INVALID_SEASON_ID],
    validate: {
      validator: async (seasonId: string) => {
        const season = await SeasonSchema.findOne({ _id: seasonId, deletedAt: null });
        // if season doesnot exists
        if (!season) return false;
        // if hasHarvestLog flag is false update it to true
        if (!season.hasHarvestLog) 
          await SeasonSchema.findByIdAndUpdate(
            season.id,
            { hasHarvestLog: true }
          );
        
        return true;
      },
      message: harvestLogMessage.INVALID_SEASON_ID,
    },
  },
  picker: {
    type: Schema.Types.ObjectId,
    ref: "Picker",
    required: [true, harvestLogMessage.INVALID_PICKER_ID],
    validate: {
      validator: (pickerId: string) =>
        !!Picker.findOne({ _id: pickerId, deletedAt: null }),
      message: harvestLogMessage.INVALID_PICKER_ID,
    },
  },
  collectedAmount: {
    type: Number,
    required: [true, harvestLogMessage.COLLECTED_AMOUNT_GREATER_THAN_ZERO],
    validate: {
      validator: (collectedAmount: number) => collectedAmount > 0,
      message: harvestLogMessage.COLLECTED_AMOUNT_GREATER_THAN_ZERO,
    },
  },
  seasonDeductions: {
    type: [Schema.Types.ObjectId],
    ref: "Deduction",
    default: []
  },
  notes: { type: String },
  
  ...AuditSchema
});

// validation to check if the 'deductionIds' are present for the given 'seasonId'
HarvestLogSchema.path("seasonDeductions").validate(async function (seasonDeductionIds) {
  let i = 0;
  while (i < seasonDeductionIds.length) {
    // get the season using the seasonId
    const season = await SeasonSchema.findById(this.season) as ISeasonSchema;
    // if deduction is not found for the current season throw error
    if (!!season.deductions.find(
        (deduction) => 
        deduction?.deductionID?.toString() === seasonDeductionIds[i]?.toString())) {
      i++; continue;
    }
    
    // season deductionIds didnot match
    return false;
  }

  // season deductionIds were not passed
  return true;
}, harvestLogMessage.INVALID_SEASON_DEDUCTION_ID);

// 'totalDeduction' virtual field computer using 'price' inside each deduction
HarvestLogSchema.virtual("totalDeduction").get(function () {
  let totalDeduction = 0;
  const season = this.season as unknown as ISeasonSchema;

  this.seasonDeductions?.forEach(({ _id }: any) => {
    const matchingDeduction = season?.deductions?.find((pd: any) => {
      return pd.deductionID.equals(_id);
    });

    if (matchingDeduction) {
      totalDeduction += matchingDeduction?.price;
    }
  });

  return totalDeduction;
});

// populate virtual fields when converting to JSON
HarvestLogSchema.set('toJSON', { virtuals: true });

const HarvestLog = model<IHarvestLogSchema>("HarvestLog", HarvestLogSchema);

export default HarvestLog;
