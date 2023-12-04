'use client';

import { useMemo, useState } from 'react';
import { DateValueType } from 'react-tailwindcss-datepicker';
import { OptimizationFormContext } from '../(context)/OptimizationFormContext';
import { OptimalVacation, findOptimalVacation } from '../algorithm/algorithm';
import { DateRange } from '../types/datetime';
import { UPPER_LIMIT_DURATION } from '../utils/constants';
import { daysDiff, parseInputStringToDate } from '../utils/datetime';
import { OptimizationInputs } from './OptimizationInputs';
import { OptimizationOutputs } from './OptimizationOutputs';

export function OptimizationForm() {
  // These memos solved a bug where between 23h-0h in UTC -3 you couldn't select the today's date.
  // It seemed to be something related to an optimization that the interval was being calculated in the server and not updated.
  const today = useMemo(() => new Date(), []);
  const interval = useMemo(
    () => ({
      from: today,
      to: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
    }),
    [today]
  );

  const [duration, setDuration] = useState(10);
  const [searchRange, setSearchRange] = useState<DateRange | { startDate: null; endDate: null }>({
    startDate: interval.from,
    endDate: interval.to,
  });
  const searchRangeIsNull = searchRange.startDate == null || searchRange.endDate == null;

  const [validationMessage, setValidationMessage] = useState('');
  const [optimalVacation, setOptimalVacation] = useState<OptimalVacation>();

  function handleClickToFindVacation() {
    if (searchRangeIsNull) return;

    const { startDate, endDate } = searchRange;

    setOptimalVacation(
      findOptimalVacation({
        lowerLimit: startDate,
        upperLimit: endDate,
        duration,
      })
    );
  }

  const handleChangeSearchRange = (newValue: DateValueType) => {
    if (newValue == null || newValue.startDate == null || newValue.endDate == null) {
      setSearchRange({ startDate: null, endDate: null });
      setValidationMessage('');
    } else {
      const { startDate, endDate } = newValue;

      const newSearchRange = {
        startDate: startDate instanceof Date ? startDate : parseInputStringToDate(startDate),
        endDate: endDate instanceof Date ? endDate : parseInputStringToDate(endDate),
      };

      if (daysDiff(newSearchRange.endDate, newSearchRange.startDate) < duration) {
        setValidationMessage(
          "These vacations won't be very good if I'm taking more days off than there are days to look for. 🤔"
        );
      } else {
        setValidationMessage('');
      }

      setSearchRange({
        startDate: startDate instanceof Date ? startDate : parseInputStringToDate(startDate),
        endDate: endDate instanceof Date ? endDate : parseInputStringToDate(endDate),
      });
    }

    setOptimalVacation(undefined);
  };

  function handleChangeDuration(newDuration: number) {
    if (isNaN(newDuration)) return;

    setDuration(Math.min(newDuration, UPPER_LIMIT_DURATION));
    setOptimalVacation(undefined);
  }

  return (
    <OptimizationFormContext.Provider
      value={{
        duration,
        handleChangeDuration,
        handleClickToFindVacation,
        handleChangeSearchRange,
        interval,
        optimalVacation,
        searchRange,
        validationMessage,
      }}>
      <OptimizationInputs />
      <OptimizationOutputs />
    </OptimizationFormContext.Provider>
  );
}
