import {
  FindOptimalVacationArgs,
  OptimalVacation,
  calculateInvestmentGainRatio,
  getHolidays,
  validateDuration,
  validateLimit,
} from '.';
import { truncateDateToDay } from '../utils/datetime';

export function findOptimalVacation(args: FindOptimalVacationArgs) {
  let { duration } = args;
  validateDuration(duration);

  const lowerLimit = truncateDateToDay(args.lowerLimit);
  const upperLimit = truncateDateToDay(args.upperLimit);

  const today = truncateDateToDay(new Date());
  const currentYear = today.getFullYear();
  const nextYearLastDayDate = truncateDateToDay(new Date(currentYear + 1, 11, 31));

  validateLimit({ lowerLimit, upperLimit, today, nextYearLastDayDate });

  const holidays = getHolidays({ ...args, currentYear });

  let vacationStart = new Date(lowerLimit);
  let vacationEnd = new Date(lowerLimit);
  vacationEnd.setDate(vacationStart.getDate() + duration - 1);

  let optimalInterval: OptimalVacation = {
    vacationStart: new Date(vacationStart),
    vacationEnd: new Date(vacationEnd),
    investmentGainRatio: calculateInvestmentGainRatio(vacationStart, vacationEnd, duration, holidays),
  };

  while (vacationEnd.getTime() < upperLimit.getTime()) {
    vacationStart.setDate(vacationStart.getDate() + 1);
    vacationEnd.setDate(vacationEnd.getDate() + 1);

    const investmentGainRatio = calculateInvestmentGainRatio(vacationStart, vacationEnd, duration, holidays);
    if (investmentGainRatio > optimalInterval.investmentGainRatio) {
      optimalInterval = {
        vacationStart: new Date(vacationStart),
        vacationEnd: new Date(vacationEnd),
        investmentGainRatio,
      };
    }
  }

  return optimalInterval;
}
