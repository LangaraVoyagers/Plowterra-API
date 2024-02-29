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
    minutes
  }
}