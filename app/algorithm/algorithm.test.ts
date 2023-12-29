import { afterEach, describe, expect, test, vi } from 'vitest';
import { calculateInvestmentGainRatio, findOptimalVacation, getHolidays, validateDuration, validateLimit } from '.';
import { daysDiff, truncateDateToDay } from '../utils/datetime';

/**
 * Mocks are hoisted to the top of the file,
 * so it's to no use declaring them inside the describe block.
 */

/**
 * For the findOptimalVacation function to call the mocked functions instead of the actual ones,
 * one of the solutions is to use separate modules for the functions to be replaced,
 * that's why they went to another file and are being imported from the file itself and not from index.ts.
 * See: https://github.com/jestjs/jest/issues/936#issuecomment-545080082
 */

vi.mock('./algorithm.helpers', async () => {
  const actual = await vi.importActual('./algorithm.helpers');
  return {
    ...actual,
    validateDuration: vi.fn(),
    validateLimit: vi.fn(),
    getHolidays: vi.fn(() => []),
    calculateInvestmentGainRatio: vi.fn(() => ratiosGeneratorInstance.next().value),
  };
});

const ratios = [1.2, 1.4, 1.1, 1, 1.8, 1.3, 1.33333, 1.6666, 1.5];
function* ratiosGenerator() {
  let index = 0;
  while (true) {
    yield ratios[index] ?? 1;
    index++;
  }
}
let ratiosGeneratorInstance = ratiosGenerator();

describe('findOptimalVacation', () => {
  const navigatorLanguages = ['pt-BR', 'pt'];
  const duration = 10;
  const lowerLimit = new Date();
  const defaultArgs = { navigatorLanguages, duration, lowerLimit };

  function getUpperLimitAndNumberOfCalculatorCalls(increment: number) {
    const initialCalculationTimes = 1;
    const compensationForCountingInitialDay = 1;

    const upperLimit = new Date(lowerLimit);
    upperLimit.setDate(lowerLimit.getDate() + duration + increment);

    const numberOfCalculatorCalls =
      daysDiff(lowerLimit, upperLimit) - duration + initialCalculationTimes + compensationForCountingInitialDay;

    return { upperLimit, numberOfCalculatorCalls };
  }

  afterEach(() => {
    vi.clearAllMocks();
    ratiosGeneratorInstance = ratiosGenerator();
  });

  describe('calls inner the functions the correct number of times', () => {
    describe('calculateInvestmentGainRatio is called the correct amount of times when interval is ', () => {
      function testNumberOfCalls(increment: number) {
        const { numberOfCalculatorCalls, upperLimit } = getUpperLimitAndNumberOfCalculatorCalls(increment);
        findOptimalVacation({ ...defaultArgs, upperLimit });
        expect(calculateInvestmentGainRatio).toHaveBeenCalledTimes(numberOfCalculatorCalls);
      }

      test('equal to duration', () => testNumberOfCalls(0));
      test('bigger than duration', () => testNumberOfCalls(1));
      test('much bigger than duration', () => testNumberOfCalls(300));
    });

    test('other functions are called the correct amount of times', () => {
      const upperLimit = new Date(lowerLimit);
      upperLimit.setDate(lowerLimit.getDate() + duration + 1);
      findOptimalVacation({ ...defaultArgs, upperLimit });

      expect(validateDuration).toHaveBeenCalledOnce();
      expect(validateLimit).toHaveBeenCalledOnce();
      expect(getHolidays).toHaveBeenCalledOnce();
    });
  });

  describe('It gets the highest investmentGainRatio calculated for an interval ', () => {
    function testGetHighestRatio(increment: number) {
      const { numberOfCalculatorCalls, upperLimit } = getUpperLimitAndNumberOfCalculatorCalls(increment);
      const maxRatioForInterval = Math.max(...ratios.slice(0, numberOfCalculatorCalls));

      const result = findOptimalVacation({ ...defaultArgs, upperLimit });
      expect(result.investmentGainRatio).toBe(maxRatioForInterval);
    }

    test('equal to the duration.', () => testGetHighestRatio(0));
    test('bigger than the duration.', () => testGetHighestRatio(1));
    test('much bigger than the duration.', () => testGetHighestRatio(300));
  });

  describe('It gets the expected output matching date and ratio for an interval ', () => {
    function testOutput(increment: number) {
      const { numberOfCalculatorCalls, upperLimit } = getUpperLimitAndNumberOfCalculatorCalls(increment);
      const expectedRatio = Math.max(...ratios.slice(0, numberOfCalculatorCalls));
      const expectedRatioIndex = ratios.findIndex(r => r === expectedRatio);

      // mimicking initialization of vacationStart and vacationEnd from actual method.
      const expectedVacationStart = truncateDateToDay(lowerLimit);
      const expectedVacationEnd = truncateDateToDay(expectedVacationStart);
      expectedVacationEnd.setDate(expectedVacationStart.getDate() + duration - 1);

      /**
       * At the max ratio, the vacation range would have slid forward "N-1" times,
       * where N is the number of times that the ratio calculator function would have been called,
       * which is equal to maxRatioIndex.
       */
      expectedVacationStart.setDate(expectedVacationStart.getDate() + expectedRatioIndex);
      expectedVacationEnd.setDate(expectedVacationEnd.getDate() + expectedRatioIndex);

      const { investmentGainRatio, vacationStart, vacationEnd } = findOptimalVacation({ ...defaultArgs, upperLimit });

      expect(investmentGainRatio).toBe(expectedRatio);
      expect(vacationStart).toEqual(expectedVacationStart);
      expect(vacationEnd).toEqual(expectedVacationEnd);
    }

    test('equal to the duration.', () => testOutput(0));
    test('bigger than the duration.', () => testOutput(1));
    test('much bigger than the duration.', () => testOutput(300));
  });
});
