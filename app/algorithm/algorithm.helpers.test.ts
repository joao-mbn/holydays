import { describe, expect, test } from 'vitest';
import {
  GetHolidaysArgs,
  calculateInvestmentGainRatio,
  getCountry,
  getHolidays,
  getLanguages,
  validateDuration,
  validateLimit,
} from '.';
import { DEFAULT_COUNTRY, DEFAULT_LANGUAGE, LOWER_LIMIT_DURATION, UPPER_LIMIT_DURATION } from '../utils/constants';
import { truncateDateToDay } from '../utils/datetime';

describe('getCountry', () => {
  test('returns the country code if available', () => {
    const navigatorLanguages = ['fr-FR', 'en-US'];
    expect(getCountry(navigatorLanguages)).toBe('FR');
  });

  test('returns default country if not country code is available', () => {
    const navigatorLanguages: string[] = ['de'];
    expect(getCountry(navigatorLanguages)).toBe(DEFAULT_COUNTRY);
  });

  test('returns default country if navigatorLanguages is empty', () => {
    const navigatorLanguages: string[] = [];
    expect(getCountry(navigatorLanguages)).toBe(DEFAULT_COUNTRY);
  });
});

describe('getLanguages', () => {
  test('returns default language if navigatorLanguages is an empty array', () => {
    const navigatorLanguages: string[] = [];
    expect(getLanguages(navigatorLanguages)).toEqual([DEFAULT_LANGUAGE]);
  });

  test('returns unique languages when provided valid locales', () => {
    const navigatorLanguages = ['en-US', 'en', 'pt-BR', 'pt', 'fr-FR', 'fr', 'es-ES', 'fr-CA', 'es-MX'];
    expect(getLanguages(navigatorLanguages)).toEqual(['en', 'es', 'fr', 'pt']);
  });

  test('filters duplicate languages and returns unique languages', () => {
    const navigatorLanguages = ['en-US', 'en-GB', 'fr-FR', 'fr-CA', 'es-ES', 'es-MX'];
    expect(getLanguages(navigatorLanguages)).toEqual(['en', 'es', 'fr']);
  });
});

describe('getHolidays', () => {
  test('returns holidays within the provided range for a valid country and languages', () => {
    const mockGetHolidaysArgs: GetHolidaysArgs = {
      currentYear: 2023,
      lowerLimit: new Date(2023, 11, 28),
      upperLimit: new Date(2024, 11, 28),
      navigatorLanguages: ['pt-BR', 'pt'],
    };
    const expectedResult = [
      new Date(2024, 0, 1),
      new Date(2024, 2, 29),
      new Date(2024, 3, 21),
      new Date(2024, 4, 1),
      new Date(2024, 8, 7),
      new Date(2024, 9, 6),
      new Date(2024, 9, 12),
      new Date(2024, 9, 27),
      new Date(2024, 10, 2),
      new Date(2024, 10, 15),
      new Date(2024, 11, 25),
    ];
    const result = getHolidays(mockGetHolidaysArgs);

    expectedResult.forEach((holiday, index) => {
      expect(truncateDateToDay(result[index])).toEqual(truncateDateToDay(holiday));
    });
  });

  test('returns US holidays within the provided range when no country is specified', () => {
    const mockGetHolidaysArgs: GetHolidaysArgs = {
      currentYear: 2023,
      lowerLimit: new Date(2023, 11, 28),
      upperLimit: new Date(2024, 11, 28),
      navigatorLanguages: [],
    };
    const expectedResult = [
      new Date(2024, 0, 1),
      new Date(2024, 0, 15),
      new Date(2024, 1, 19),
      new Date(2024, 4, 27),
      new Date(2024, 5, 19),
      new Date(2024, 6, 4),
      new Date(2024, 8, 2),
      new Date(2024, 9, 14),
      new Date(2024, 10, 11),
      new Date(2024, 10, 28),
      new Date(2024, 11, 25),
    ];
    const result1 = getHolidays(mockGetHolidaysArgs);
    const result2 = getHolidays({ ...mockGetHolidaysArgs, navigatorLanguages: ['de'] });

    expectedResult.forEach((holiday, index) => {
      expect(truncateDateToDay(result1[index])).toEqual(truncateDateToDay(holiday));
    });
    expectedResult.forEach((holiday, index) => {
      expect(truncateDateToDay(result2[index])).toEqual(truncateDateToDay(holiday));
    });
  });

  test('returns an empty array if no public holidays are found in the interval', () => {
    const mockGetHolidaysArgs: GetHolidaysArgs = {
      currentYear: 2023,
      lowerLimit: new Date(2024, 2, 10),
      upperLimit: new Date(2024, 3, 25),
      navigatorLanguages: ['en-US'],
    };
    expect(getHolidays(mockGetHolidaysArgs)).toHaveLength(0);
  });
});

describe('validateDuration', () => {
  test('throws an error when duration exceeds upper limit', () => {
    const duration = UPPER_LIMIT_DURATION + 1;
    expect(() => validateDuration(duration)).toThrowError('Exceeded upper limit of days.');
  });

  test('throws an error when duration is below lower limit', () => {
    const duration = LOWER_LIMIT_DURATION - 1;
    expect(() => validateDuration(duration)).toThrowError('Exceeded lower limit of days.');
  });

  test('does not throw an error when duration is within limits', () => {
    const duration = (LOWER_LIMIT_DURATION + UPPER_LIMIT_DURATION) / 2;
    expect(() => validateDuration(duration)).not.toThrow();
  });
});

describe('validateLimit function', () => {
  const today = new Date();
  const nextYearLastDayDate = new Date(today.getFullYear() + 1, 11, 31);

  test('throws an error when lowerLimit is earlier than today', () => {
    const lowerLimit = new Date(today);
    lowerLimit.setFullYear(lowerLimit.getFullYear() - 1);
    const upperLimit = new Date(nextYearLastDayDate);

    expect(() => validateLimit({ lowerLimit, upperLimit, nextYearLastDayDate, today })).toThrowError(
      'Lower end of interval cannot be earlier than today.'
    );
  });

  test('throws an error when upperLimit exceeds the end of next year', () => {
    const lowerLimit = new Date(today);
    const upperLimit = new Date(nextYearLastDayDate);
    upperLimit.setFullYear(upperLimit.getFullYear() + 1);

    expect(() => validateLimit({ lowerLimit, upperLimit, nextYearLastDayDate, today })).toThrowError(
      'Upper end of interval cannot exceed end of next year.'
    );
  });

  test('does not throw an error when limits are within valid range', () => {
    const lowerLimit = new Date(today);
    const upperLimit = new Date(nextYearLastDayDate);

    expect(() => validateLimit({ lowerLimit, upperLimit, nextYearLastDayDate, today })).not.toThrow();
  });
});

describe('calculateInvestmentGainRatio', () => {
  test('has the correct ratio when there is no adjacent weekends or holidays', () => {
    const start = new Date(2024, 0, 16); // Jan 16nd, 2024. Tuesday.
    const end = new Date(2024, 0, 18); // Jan 18th, 2024. Thursday.
    const holidays: Date[] = [];
    const invested = 3;

    const ratio = calculateInvestmentGainRatio(start, end, invested, holidays);
    expect(ratio).toBe(1);
  });

  test('has the correct ratio when there is adjacent weekends looking forward', () => {
    const start = new Date(2024, 0, 16); // Jan 16th, 2024. Tuesday.
    const end = new Date(2024, 0, 19); // Jan 19th, 2024. Friday.
    const holidays: Date[] = [];
    const invested = 4;

    const ratio = calculateInvestmentGainRatio(start, end, invested, holidays);
    expect(ratio).toBe(1.5);
  });

  test('has the correct ratio when there is adjacent weekends looking backwards', () => {
    const start = new Date(2024, 0, 15); // Jan 15th, 2024. Monday.
    const end = new Date(2024, 0, 18); // Jan 18th, 2024. Thursday.
    const holidays: Date[] = [];
    const invested = 4;

    const ratio = calculateInvestmentGainRatio(start, end, invested, holidays);
    expect(ratio).toBe(1.5);
  });

  test('has the correct ratio when there is adjacent weekends looking forwards and backwards', () => {
    const start = new Date(2024, 0, 15); // Jan 15th, 2024. Monday.
    const end = new Date(2024, 0, 19); // Jan 19th, 2024. Friday.
    const holidays: Date[] = [];
    const invested = 5;

    const ratio = calculateInvestmentGainRatio(start, end, invested, holidays);
    expect(ratio).toBe(1.8);
  });

  test('has the correct ratio when there is a holiday inside the interval', () => {
    const start = new Date(2024, 0, 16); // Jan 16th, 2024. Tuesday.
    const end = new Date(2024, 0, 18); // Jan 18th, 2024. Thursday.
    const holidays: Date[] = [new Date(2024, 0, 17)]; // Jan 17th, 2024. Wednesday.
    const invested = 3;

    const ratio = calculateInvestmentGainRatio(start, end, invested, holidays);
    expect(ratio).toBe(1);
  });

  test('has the correct ratio when there is a holiday in the edge of the interval', () => {
    const start = new Date(2024, 0, 16); // Jan 16th, 2024. Tuesday.
    const end = new Date(2024, 0, 18); // Jan 18th, 2024. Thursday.
    const holidays: Date[] = [new Date(2024, 0, 16)]; // Jan 16th, 2024. Tuesday.
    const invested = 3;

    const ratio = calculateInvestmentGainRatio(start, end, invested, holidays);
    expect(ratio).toBe(1);
  });

  test('has the correct ratio when interval is adjacent to a holiday', () => {
    const start = new Date(2024, 0, 17); // Jan 17th, 2024. Wednesday.
    const end = new Date(2024, 0, 18); // Jan 18th, 2024. Thursday.
    const holidays: Date[] = [new Date(2024, 0, 16)]; // Jan 16th, 2024. Tuesday.
    const invested = 2;

    const ratio = calculateInvestmentGainRatio(start, end, invested, holidays);
    expect(ratio).toBe(1.5);
  });

  test('has the correct ratio when holiday adjacent to interval makes a bridge to a weekend', () => {
    const start = new Date(2024, 0, 16); // Jan 16th, 2024. Tuesday.
    const end = new Date(2024, 0, 18); // Jan 18th, 2024. Thursday.
    const holidays: Date[] = [new Date(2024, 0, 15)]; // Jan 15th, 2024. Monday.
    const invested = 3;

    const ratio = calculateInvestmentGainRatio(start, end, invested, holidays);
    expect(ratio).toBe(2);
  });

  test('has the correct ratio when weekend adjacent to interval makes a bridge to a holiday', () => {
    const start = new Date(2024, 0, 15); // Jan 15th, 2024. Monday.
    const end = new Date(2024, 0, 17); // Jan 17th, 2024. Wednesday.
    const holidays: Date[] = [new Date(2024, 0, 12)]; // Jan 12th, 2024. Friday.
    const invested = 3;

    const ratio = calculateInvestmentGainRatio(start, end, invested, holidays);
    expect(ratio).toBe(2);
  });
});
