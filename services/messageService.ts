import dotenv from "dotenv";
import { Request, Response } from "express";
import twilio from "twilio";
dotenv.config();

let client: twilio.Twilio;

try {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Twilio account SID and auth token must be provided");
  }

  client = twilio(accountSid, authToken);
} catch (error) {
  console.error("Error initializing Twilio client:", error);
}

export const createSMSlog = async (
  req: Request,
  res: Response,
  pickerPhone: string,
  pickerName: string,
  netAmount: number,
  unit: string,
  product: string,
  payment: number,
  currency: string
) => {
  try {
    if (
      pickerPhone === "16724726022" ||
      pickerPhone === "16723384114" ||
      pickerPhone === "16722720083" ||
      pickerPhone === "12368632684" ||
      pickerPhone === "17788660539" ||
      pickerPhone === "16047248728" ||
      pickerPhone === "12369656249" ||
      pickerPhone === "17788586742"
    ) {
      const message = await client.messages.create({
        body: `Hi ${pickerName}, you have collected ${netAmount} ${unit.toLowerCase()} of ${product.toLowerCase()}. That means you've earned ${currency} ${payment} for your next paycheck.`,
        from: "+16205914371",
        to: `+${pickerPhone}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const createSMSpayroll = async (
  req: Request,
  res: Response,
  phoneSMS: string[],
  nameSMS: string[],
  netAmountSMS: number[],
  collectedAmountSMS: number[],
  currencySMS: string,
  productSMS: string,
  unitSMS: string[]
) => {
  try {
    for (let index = 0; index < phoneSMS.length; index++) {
      if (
        phoneSMS[index] === "16724726022" ||
        phoneSMS[index] === "16723384114" ||
        phoneSMS[index] === "16722720083" ||
        phoneSMS[index] === "12368632684" ||
        phoneSMS[index] === "17788660539" ||
        phoneSMS[index] === "16047248728" ||
        phoneSMS[index] === "12369656249" ||
        phoneSMS[index] === "17788586742"
      ) {
        const message = await client.messages.create({
          body: `Hi ${nameSMS[index]}, your payment for this payroll is ${currencySMS} ${netAmountSMS[index]} for a total collection of ${collectedAmountSMS[index]} ${unitSMS[index]} of ${productSMS}.`,
          from: "+16205914371",
          to: `+${phoneSMS[index]}`,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
