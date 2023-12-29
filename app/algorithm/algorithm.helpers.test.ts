import { describe, expect, test } from 'vitest';
import { GetHolidaysArgs, getCountry, getHolidays, getLanguages, validateDuration, validateLimit } from '.';
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
  const today = new Date(2023, 6, 15);
  const nextYearLastDayDate = new Date(2024, 11, 31);

  test('throws an error when lowerLimit is earlier than today', () => {
    const lowerLimit = new Date(2023, 6, 10);
    const upperLimit = new Date(2023, 6, 20);

    expect(() => validateLimit({ lowerLimit, upperLimit, nextYearLastDayDate, today })).toThrowError(
      'Lower end of interval cannot be earlier than today.'
    );
  });

  test('throws an error when upperLimit exceeds the end of next year', () => {
    const lowerLimit = new Date(2023, 7, 1);
    const upperLimit = new Date(2025, 0, 1);

    expect(() => validateLimit({ lowerLimit, upperLimit, nextYearLastDayDate, today })).toThrowError(
      'Upper end of interval cannot exceed end of next year.'
    );
  });

  test('does not throw an error when limits are within valid range', () => {
    const lowerLimit = new Date(2023, 8, 1);
    const upperLimit = new Date(2024, 10, 1);

    expect(() => validateLimit({ lowerLimit, upperLimit, nextYearLastDayDate, today })).not.toThrow();
  });
});
