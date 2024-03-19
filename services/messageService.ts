import dotenv from "dotenv";
import { Request, Response } from "express";
import twilio from "twilio";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const createMSM = async (
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
    const message = await client.messages.create({
      body: `Hi ${pickerName}, you have collected ${netAmount} ${unit.toLowerCase()} of ${product.toLowerCase()}. That means you've earned ${currency} ${payment} for your next paycheck.`,
      from: "+16205914371",
      to: `+${pickerPhone}`,
    });
  } catch (error) {
    console.error(error);
  }
};
