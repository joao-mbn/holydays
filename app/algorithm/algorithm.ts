import { FindOptimalVacationArgs, OptimalVacation, getHolidays, validateDuration, validateLimit } from '.';
import { compareDateAtDay, getWeekDay, truncateDateToDay } from '../utils/datetime';

export function findOptimalVacation(args: FindOptimalVacationArgs) {
  let { duration, lowerLimit, upperLimit } = args;
  validateDuration(duration);

  lowerLimit = truncateDateToDay(lowerLimit);
  upperLimit = truncateDateToDay(upperLimit);

  const today = truncateDateToDay(new Date());
  const currentYear = today.getFullYear();
  const nextYearLastDayDate = truncateDateToDay(new Date(currentYear + 1, 11, 31));

  validateLimit({ lowerLimit, upperLimit, today, nextYearLastDayDate });

  const holidays = getHolidays({ ...args, currentYear });

  let vacationStart = lowerLimit;
  let vacationEnd = new Date(lowerLimit);
  vacationEnd.setDate(lowerLimit.getDate() + duration - 1);

  let optimalInterval: OptimalVacation = {
    vacationStart: new Date(vacationStart),
    vacationEnd: new Date(vacationEnd),
    investmentGainRatio: calculateInvestmentGainRatio(vacationStart, vacationEnd, duration, holidays),
  };

  while (vacationEnd.getTime() <= upperLimit.getTime()) {
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

function calculateInvestmentGainRatio(start: Date, end: Date, duration: number, holidays: Date[]) {
  const invested = duration;
  let gained = duration;

  let freeDaysStart = new Date(start);
  let dayBeforeStart = new Date(freeDaysStart);
  dayBeforeStart.setDate(freeDaysStart.getDate() - 1);

  while (
    getWeekDay(freeDaysStart) === 'monday' ||
    getWeekDay(freeDaysStart) === 'sunday' ||
    holidays.some(h => compareDateAtDay(dayBeforeStart, h))
  ) {
    freeDaysStart = dayBeforeStart;

    dayBeforeStart = new Date(freeDaysStart);
    dayBeforeStart.setDate(freeDaysStart.getDate() - 1);
    gained++;
  }

  let freeDaysEnd = new Date(end);
  let dayAfterEnd = new Date(freeDaysEnd);
  dayAfterEnd.setDate(freeDaysEnd.getDate() + 1);

  while (
    getWeekDay(freeDaysEnd) === 'friday' ||
    getWeekDay(freeDaysEnd) === 'saturday' ||
    holidays.some(h => compareDateAtDay(dayAfterEnd, h))
  ) {
    freeDaysEnd = dayAfterEnd;

    dayAfterEnd = new Date(freeDaysEnd);
    dayAfterEnd.setDate(freeDaysEnd.getDate() + 1);
    gained++;
  }

  return gained / invested;
}
