import { PayrollTimeframeEnum } from "../models/Season";

export const compareDates = (epoch1: number, epoch2: number) => {
  // inspired from https://stackoverflow.com/questions/13903897/javascript-return-number-of-days-hours-minutes-seconds-between-two-dates

  let delta = Math.abs(epoch1 - epoch2) / 1000;

  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  return {
    days,
    hours,
    minutes,
  };
};

export const calculatePayrollEndDate = (
  startDate: Date,
  timeframe: `${PayrollTimeframeEnum}`
) => {
  const daysInTheWeek = 7;

  if (timeframe === "Weekly") {
    const weeks = 1;
    startDate.setDate(startDate.getDate() + daysInTheWeek * weeks);
    return startDate;
  }

  if (timeframe === "Monthly") {
    const months = 1;
    startDate.setMonth(startDate.getMonth() + months);
    return startDate;
  }

  //Default to 2 weeks
  //  if(timeframe === "Bi-Weekly"){
  const weeks = 2;
  startDate.setDate(startDate.getDate() + daysInTheWeek * weeks);
  return startDate;
  //  }
};
