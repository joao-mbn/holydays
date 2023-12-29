import Holidays from 'date-holidays';
import { GetHolidaysArgs, ValidateLimitArgs } from '.';
import { DEFAULT_COUNTRY, DEFAULT_LANGUAGE, LOWER_LIMIT_DURATION, UPPER_LIMIT_DURATION } from '../utils/constants';
import { truncateDateToDay } from '../utils/datetime';

export function getHolidays({ navigatorLanguages, currentYear, lowerLimit, upperLimit }: GetHolidaysArgs): Date[] {
  const country = getCountry(navigatorLanguages);
  const languages = getLanguages(navigatorLanguages);

  const region = new Holidays(country, { languages, types: ['public'] });

  const thisYearHolidays = region.getHolidays(currentYear);
  const nextYearHolidays = region.getHolidays(currentYear + 1);

  const holidays = thisYearHolidays
    .concat(nextYearHolidays)
    .filter(h => h.start >= lowerLimit && h.end <= upperLimit)
    .map(h => truncateDateToDay(h.start));

  return holidays;
}

export function getCountry(navigatorLanguages: string[]) {
  return navigatorLanguages[0]?.split('-')[1] ?? DEFAULT_COUNTRY;
}

export function getLanguages(navigatorLanguages: string[]) {
  const parsedLanguages = navigatorLanguages
    .map(l => l.split('-')[0])
    .sort()
    .filter((l, i, self) => l !== self[i + 1]);
  const languages = parsedLanguages == null || parsedLanguages.length === 0 ? [DEFAULT_LANGUAGE] : parsedLanguages;
  return languages;
}

export function validateDuration(duration: number) {
  if (duration > UPPER_LIMIT_DURATION) throw new Error('Exceeded upper limit of days.');
  if (duration < LOWER_LIMIT_DURATION) throw new Error('Exceeded lower limit of days.');
}

export function validateLimit({ lowerLimit, upperLimit, nextYearLastDayDate, today }: ValidateLimitArgs) {
  if (lowerLimit < today) {
    throw new Error('Lower end of interval cannot be earlier than today.');
  }

  if (upperLimit > nextYearLastDayDate) {
    throw new Error('Upper end of interval cannot exceed end of next year.');
  }
}
