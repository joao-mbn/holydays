import { describe, expect, test } from 'vitest';
import {
  compareDateAtDay,
  dateMax,
  dateMin,
  daysDiff,
  getWeekDay,
  parseDateToInputString,
  parseInputStringToDate,
  truncateDateToDay,
} from './datetime';

describe('truncateDateToDay', () => {
  test('truncate date to day without time information', () => {
    const date = new Date(2023, 5, 15, 10, 30, 0); // June 15, 2023, 10:30 AM
    const truncatedDate = truncateDateToDay(date);

    expect(truncatedDate.getFullYear()).toBe(2023);
    expect(truncatedDate.getMonth()).toBe(5); // Months are zero-indexed
    expect(truncatedDate.getDate()).toBe(15);
    expect(truncatedDate.getHours()).toBe(0);
    expect(truncatedDate.getMinutes()).toBe(0);
    expect(truncatedDate.getSeconds()).toBe(0);
    expect(truncatedDate.getMilliseconds()).toBe(0);
  });

  test('handle leap year correctly', () => {
    const date = new Date(2024, 1, 29, 15, 45, 30); // February 29, 2024, 3:45 PM
    const truncatedDate = truncateDateToDay(date);

    expect(truncatedDate.getFullYear()).toBe(2024);
    expect(truncatedDate.getMonth()).toBe(1);
    expect(truncatedDate.getDate()).toBe(29);
    expect(truncatedDate.getHours()).toBe(0);
    expect(truncatedDate.getMinutes()).toBe(0);
    expect(truncatedDate.getSeconds()).toBe(0);
    expect(truncatedDate.getMilliseconds()).toBe(0);
  });

  test('truncate date to day for different timezones', () => {
    const date = new Date('2023-09-25T03:45:00-07:00'); // September 25, 2023, 3:45 AM UTC
    const truncatedDate = truncateDateToDay(date);

    expect(truncatedDate.getFullYear()).toBe(2023);
    expect(truncatedDate.getMonth()).toBe(8);
    expect(truncatedDate.getDate()).toBe(25);
    expect(truncatedDate.getHours()).toBe(0);
    expect(truncatedDate.getMinutes()).toBe(0);
    expect(truncatedDate.getSeconds()).toBe(0);
    expect(truncatedDate.getMilliseconds()).toBe(0);
  });
});

describe('compareDateAtDay', () => {
  test('return true for dates with different times but the same day', () => {
    const date1 = new Date(2023, 11, 25, 9, 0, 0); // December 25, 2023, 9:00 AM
    const date2 = new Date(2023, 11, 25, 20, 30, 0); // December 25, 2023, 8:30 PM

    expect(compareDateAtDay(date1, date2)).toBe(true);
  });

  test('return false for dates with different days', () => {
    const date1 = new Date(2023, 2, 15, 15, 0, 0); // March 15, 2023, 3:00 PM
    const date2 = new Date(2023, 2, 16, 9, 30, 0); // March 16, 2023, 9:30 AM

    expect(compareDateAtDay(date1, date2)).toBe(false);
  });

  test('return false for dates with different months and years', () => {
    const date1 = new Date(2023, 5, 10, 10, 0, 0); // June 10, 2023, 10:00 AM
    const date2 = new Date(2024, 5, 10, 10, 0, 0); // June 10, 2024, 10:00 AM

    expect(compareDateAtDay(date1, date2)).toBe(false);
  });
});

describe('getWeekDay', () => {
  test('return correct weekday for December 24, 2023 (Sunday) at 12:00 PM', () => {
    const date = new Date(2023, 11, 24, 12, 0, 0); // December 24, 2023, 12:00 PM (Sunday)

    expect(getWeekDay(date)).toBe('sunday');
  });

  test('return correct weekday for December 25, 2023 (Monday) at 9:00 AM', () => {
    const date = new Date(2023, 11, 25, 9, 0, 0); // December 25, 2023, 9:00 AM (Monday)

    expect(getWeekDay(date)).toBe('monday');
  });

  test('return correct weekday for December 26, 2023 (Tuesday) at 3:30 PM', () => {
    const date = new Date(2023, 11, 26, 15, 30, 0); // December 26, 2023, 3:30 PM (Tuesday)

    expect(getWeekDay(date)).toBe('tuesday');
  });

  test('return correct weekday for December 27, 2023 (Wednesday) at 8:45 AM', () => {
    const date = new Date(2023, 11, 27, 8, 45, 0); // December 27, 2023, 8:45 AM (Wednesday)

    expect(getWeekDay(date)).toBe('wednesday');
  });

  test('return correct weekday for December 28, 2023 (Thursday) at 2:00 PM', () => {
    const date = new Date(2023, 11, 28, 14, 0, 0); // December 28, 2023, 2:00 PM (Thursday)

    expect(getWeekDay(date)).toBe('thursday');
  });

  test('return correct weekday for December 29, 2023 (Friday) at 10:15 AM', () => {
    const date = new Date(2023, 11, 29, 10, 15, 0); // December 29, 2023, 10:15 AM (Friday)

    expect(getWeekDay(date)).toBe('friday');
  });

  test('return correct weekday for December 30, 2023 (Saturday) at 5:30 PM', () => {
    const date = new Date(2023, 11, 30, 17, 30, 0); // December 30, 2023, 5:30 PM (Saturday)

    expect(getWeekDay(date)).toBe('saturday');
  });
});

describe('parseDateToInputString', () => {
  test('return correct string for a date in January 2023', () => {
    const date = new Date(2023, 0, 15); // January 15, 2023

    expect(parseDateToInputString(date)).toBe('2023-01-15');
  });

  test('return correct string for a date that could be another in international time', () => {
    const date1 = new Date(2023, 11, 25, 23, 59, 59); // December 25, 2023, 23:59:59
    const date2 = new Date(2023, 11, 25, 0, 0, 1); // December 25, 2023, 0:00:01

    expect(parseDateToInputString(date1)).toBe('2023-12-25');
    expect(parseDateToInputString(date2)).toBe('2023-12-25');
  });

  test('return correct string for a date in a leap year', () => {
    const date = new Date(2024, 1, 29); // February 29, 2024 (leap year)

    expect(parseDateToInputString(date)).toBe('2024-02-29');
  });
});

describe('parseInputStringToDate', () => {
  test('parse a valid date string correctly', () => {
    const dateString = '2023-12-31';
    const result = parseInputStringToDate(dateString);
    expect(result instanceof Date).toBe(true);
    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(31);
  });

  test('return correct date for a string that could represent another date in international time', () => {
    const dateString1 = '2023-12-31T23:59:59Z';
    const dateString2 = '2023-12-31T00:00:01Z';

    const result1 = parseInputStringToDate(dateString1);
    const result2 = parseInputStringToDate(dateString2);
    expect(result1.getFullYear()).toBe(2023);
    expect(result1.getMonth()).toBe(11);
    expect(result1.getDate()).toBe(31);
    expect(result2.getFullYear()).toBe(2023);
    expect(result2.getMonth()).toBe(11);
    expect(result2.getDate()).toBe(31);
  });

  test('return Invalid Date for an invalid date string', () => {
    const invalidDateString = 'invalid date';
    const result = parseInputStringToDate(invalidDateString);
    expect(result.toString()).toBe('Invalid Date');
  });
});

describe('daysDiff', () => {
  test('should calculate difference between two dates', () => {
    const date1 = new Date(2024, 2, 1);
    const date2 = new Date(2024, 2, 20);
    const result = daysDiff(date1, date2);
    expect(result).toBe(19);
  });

  test('should handle negative difference correctly', () => {
    const date1 = new Date(2024, 0, 1);
    const date2 = new Date(2023, 11, 31);
    const result = daysDiff(date1, date2);
    expect(result).toBe(1); // Absolute difference is 1 day, regardless of order
  });

  test('should return 0 for the same date', () => {
    const date1 = new Date(2023, 11, 31, 0, 0, 0);
    const date2 = new Date(2023, 11, 31, 23, 59, 59);
    const result = daysDiff(date1, date2);
    expect(result).toBe(0);
  });

  test('should difference comparing to the precision of days, even if the difference in hours or any smaller unit would cause the result to change.', () => {
    const date1 = new Date(2023, 11, 31, 10, 0, 0);
    const date2 = new Date(2023, 11, 30, 20, 0, 0);
    const result = daysDiff(date1, date2);
    expect(result).toBe(1);
  });
});

describe('dateMin', () => {
  test('should return the minimum date', () => {
    const date1 = new Date(2023, 11, 31); // December 31, 2023
    const date2 = new Date(2024, 0, 1); // January 1, 2024
    const result = dateMin(date1, date2);
    expect(result).toEqual(date1);
  });

  test('should return the minimum date', () => {
    const date1 = new Date(2023, 11, 31); // December 31, 2023
    const date2 = new Date(2024, 11, 31, 1); // December 31, 2023, 1:00 AM
    const result = dateMin(date1, date2);
    expect(result).toEqual(date1);
  });

  test('should return the same date when dates are equal', () => {
    const date1 = new Date(2023, 6, 15); // July 15, 2023
    const date2 = new Date(2023, 6, 15); // July 15, 2023
    const result = dateMin(date1, date2);
    expect(result).toEqual(date1);
    expect(result).toEqual(date2);
  });
});

describe('dateMax', () => {
  test('should return the minimum date', () => {
    const date1 = new Date(2023, 11, 31); // December 31, 2023
    const date2 = new Date(2024, 0, 1); // January 1, 2024
    const result = dateMax(date1, date2);
    expect(result).toEqual(date2);
  });

  test('should return the minimum date', () => {
    const date1 = new Date(2023, 11, 31); // December 31, 2023
    const date2 = new Date(2024, 11, 31, 1); // December 31, 2023, 1:00 AM
    const result = dateMax(date1, date2);
    expect(result).toEqual(date2);
  });

  test('should return the same date when dates are equal', () => {
    const date1 = new Date(2023, 6, 15); // July 15, 2023
    const date2 = new Date(2023, 6, 15); // July 15, 2023
    const result = dateMax(date1, date2);
    expect(result).toEqual(date1);
    expect(result).toEqual(date2);
  });
});
