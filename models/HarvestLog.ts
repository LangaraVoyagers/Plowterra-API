import { ObjectId, Schema, model } from "mongoose";

import Deduction from "./Deduction";
import { IDeduction } from "../interfaces/deduction.interface";
import { IHarvestLog } from "../interfaces/harvestLog.interface";
import { ISeason } from "../interfaces/season.interface";
import Picker from "./Picker";
import SeasonSchema from "./Season";
import harvestLogMessage from "../messages/harvestLog.messages";

const HarvestLogSchema = new Schema<IHarvestLog>(
  {
    season: {
      type: Schema.Types.ObjectId,
      ref: "Season",
      required: [true, harvestLogMessage.INVALID_SEASON_ID],
      validate: {
        validator: (seasonId: string) =>
          !!SeasonSchema.findOne({ _id: seasonId, deletedAt: null }),
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
    },
    // seasonDeductionIds: {
    //   type: [String],
    //   validate: {
    //     validator: async function (seasonDeductionIds: Array<String>) {
    //       if (seasonDeductionIds.length > 0) {
    //         let i = 0;
    //         while (i < seasonDeductionIds.length) {
    //           const season = (await SeasonSchema.findById(
    //             (this as any).seasonId
    //           )) as ISeason;
    //           if (
    //             !season.deductions.find(
    //               (deduction) =>
    //                 (deduction.deductionID as ObjectId).toString() ===
    //                 seasonDeductionIds[i++]
    //             )
    //           )
    //             return false;
    //         }
    //         return true;
    //       }
    //       return true;
    //     },
    //     message: harvestLogMessage.INVALID_SEASON_DEDUCTION_ID,
    //   },
    //   default: [],
    // },
    notes: { type: String },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

HarvestLogSchema.virtual("totalDeduction").get(function () {
  let totalDeduction = 0;
  // console.log(this);
  // const season = await SeasonSchema.findById(this.seasonId) as ISeason;
  // this.seasonDeductionIds.forEach(async (deductionId: string) => {
  //   const matchingDeduction = season.deductions.find((deductionObj) => (deductionObj.deductionID as ObjectId).toString() === deductionId);
  //   if (matchingDeduction) totalDeduction += matchingDeduction?.price;
  // })
  const season = this.season as unknown as ISeason;

  this.seasonDeductions.forEach(({ _id }: any) => {
    const matchingDeduction = season.deductions.find((pd: any) => {
      return pd.deductionID.equals(_id);
    });

    if (matchingDeduction) {
      totalDeduction += matchingDeduction?.price;
    }
  });

  return totalDeduction;
});

// HarvestLogSchema.methods.getSeasonInfo = async function () {
//   return await SeasonSchema.findById(this.seasonId);
// }

const HarvestLog = model<IHarvestLog>("HarvestLog", HarvestLogSchema);

export default HarvestLog;
