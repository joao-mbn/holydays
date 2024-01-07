'use client';

import { useMemo, useState } from 'react';
import { OptimalVacation, findOptimalVacation } from '../../algorithm';
import { UPPER_LIMIT_DURATION } from '../../utils/constants';
import { DateRange, dateMax, dateMin, daysDiff, parseInputStringToDate } from '../../utils/datetime';
import { OptimizationFormContext } from './OptimizationFormContext';
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

  const minFrom = interval.from;
  /* truncation is needed if the user puts end date smaller than lower limit */
  const maxFrom = searchRange.endDate == null ? interval.to : dateMax(interval.from, searchRange.endDate);
  /* truncation is needed if the user puts the start date bigger than the upper limit */
  const minTo = searchRange.startDate == null ? interval.from : dateMin(interval.to, searchRange.startDate);
  const maxTo = interval.to;

  function handleClickToFindVacation() {
    if (searchRangeIsNull) return;

    const { startDate, endDate } = searchRange;

    setOptimalVacation(
      findOptimalVacation({
        lowerLimit: startDate,
        upperLimit: endDate,
        duration,
        navigatorLanguages: [...navigator.languages],
      })
    );
  }

  const handleChangeSearchRange = (newDate: string, position: keyof DateRange) => {
    let _newDate: Date | null;
    if (!newDate || isNaN(Number(parseInputStringToDate(newDate)))) {
      _newDate = null;
    } else {
      _newDate = parseInputStringToDate(newDate);
    }

    const newSearchRange = { ...searchRange, [position]: _newDate };

    setSearchRange(newSearchRange);
    setOptimalVacation(undefined);

    validateRangeWithDuration(duration, newSearchRange);
  };

  function handleChangeDuration(newDuration: number) {
    if (isNaN(newDuration)) return;

    const _newDuration = Math.min(newDuration, UPPER_LIMIT_DURATION);
    setDuration(_newDuration);
    setOptimalVacation(undefined);

    validateRangeWithDuration(_newDuration, searchRange);
  }

  function validateChangesOnSearchRangeLeave() {
    /* Validations on manual date text input that
       can bypass the input date validation and allow any date.
       Changing this on the onChange would worsen UX.
    */
    const newSearchRange = { ...searchRange };
    if (newSearchRange.startDate != null) {
      newSearchRange.startDate = dateMax(newSearchRange.startDate, minFrom);
      newSearchRange.startDate = dateMin(newSearchRange.startDate, maxFrom);
    }

    if (newSearchRange.endDate != null) {
      newSearchRange.endDate = dateMax(newSearchRange.endDate, minTo);
      newSearchRange.endDate = dateMin(newSearchRange.endDate, maxTo);
    }

    setSearchRange(newSearchRange);
    validateRangeWithDuration(duration, newSearchRange);
  }

  function validateRangeWithDuration(_duration: typeof duration, _searchRange: typeof searchRange) {
    if (_searchRange.startDate == null || _searchRange.endDate == null) {
      setValidationMessage('');
    } else if (daysDiff(_searchRange.endDate, _searchRange.startDate) + 1 < _duration) {
      setValidationMessage(
        "These vacations won't be very good if I'm taking more days off than there are days to look for. 🤔"
      );
    } else {
      setValidationMessage('');
    }
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
        allowedRange: { minFrom, maxFrom, minTo, maxTo },
        validateChangesOnSearchRangeLeave,
      }}>
      <OptimizationInputs />
      <OptimizationOutputs />
    </OptimizationFormContext.Provider>
  );
}
