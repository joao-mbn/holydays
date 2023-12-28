import Holidays from 'date-holidays';
import { LOWER_LIMIT_DURATION, UPPER_LIMIT_DURATION } from '../utils/constants';
import { compareDateAtDay, getWeekDay, truncateDateToDay } from '../utils/datetime';

type CommonArgs = {
  navigatorLanguages: string[];
  lowerLimit: Date;
  upperLimit: Date;
};

type GetHolidaysArgs = CommonArgs & {
  currentYear: number;
};

type FindOptimalVacationArgs = CommonArgs & {
  duration: number;
  isClt?: boolean;
  swapThurdaysAndTuesdaysHolidays?: boolean;
};

export type OptimalVacation = {
  vacationStart: Date;
  vacationEnd: Date;
  investmentGainRatio: number;
};

export function findOptimalVacation(args: FindOptimalVacationArgs) {
  const { lowerLimit, upperLimit, duration } = args;

  if (duration > UPPER_LIMIT_DURATION) throw new Error('Exceeded upper limit of days.');
  if (duration < LOWER_LIMIT_DURATION) throw new Error('Exceeded lower limit of days.');

  const currentYear = new Date().getFullYear();
  const lowerLimitDate = truncateDateToDay(lowerLimit);
  const upperLimitDate = truncateDateToDay(upperLimit);
  const today = truncateDateToDay(new Date());
  const nextYearLastDay = truncateDateToDay(new Date(currentYear + 1, 11, 31));

  if (lowerLimitDate < today) {
    throw new Error('Lower end of interval cannot be earlier than today.');
  }

  if (upperLimitDate > nextYearLastDay) {
    throw new Error('Upper end of interval cannot exceed end of next year.');
  }

  const holidays = getHolidays({ ...args, currentYear });

  let vacationStart = lowerLimitDate;
  let vacationEnd = new Date(lowerLimitDate);
  vacationEnd.setDate(lowerLimitDate.getDate() + duration - 1);

  let optimalInterval: OptimalVacation = {
    vacationStart: new Date(vacationStart),
    vacationEnd: new Date(vacationEnd),
    investmentGainRatio: calculateInvestmentGainRatio(vacationStart, vacationEnd, duration, holidays),
  };

  while (vacationEnd.getTime() <= upperLimitDate.getTime()) {
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

function getHolidays({ navigatorLanguages, currentYear, lowerLimit, upperLimit }: GetHolidaysArgs): Date[] {
  const country = navigatorLanguages?.[0]?.split('-')[1] ?? 'US';
  const parsedLanguages = navigatorLanguages
    ?.map(l => l.split('-')[0])
    ?.toSorted()
    .filter((l, i, self) => l !== self[i + 1]);
  const languages = parsedLanguages == null || parsedLanguages.length === 0 ? ['en'] : parsedLanguages;

  const region = new Holidays(country, { languages, types: ['public'] });

  const thisYearHolidays = region.getHolidays(currentYear);
  const nextYearHolidays = region.getHolidays(currentYear + 1);

  const holidays = thisYearHolidays
    .concat(nextYearHolidays)
    .filter(h => h.start >= lowerLimit && h.end <= upperLimit)
    .map(h => h.start);

  return holidays;
}
