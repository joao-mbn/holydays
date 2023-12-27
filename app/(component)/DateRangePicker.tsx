import { useOptimizationFormContext } from '../(context)/OptimizationFormContext';
import { parseDateToInputString } from '../utils/datetime';

export function DateRangePicker() {
  const {
    handleChangeSearchRange,
    interval,
    searchRange,
    allowedRange: { minFrom, maxFrom, minTo, maxTo },
    validateChangesOnSearchRangeLeave,
  } = useOptimizationFormContext();

  const searchRangeIsNull = searchRange.startDate == null || searchRange.endDate == null;

  return (
    <>
      <input
        aria-label="start date picker"
        className="mx-2 mb-2 rounded-lg bg-sky-100/80 px-1"
        value={searchRangeIsNull ? undefined : parseDateToInputString(searchRange.startDate)}
        type="date"
        min={parseDateToInputString(minFrom)}
        max={parseDateToInputString(maxFrom)}
        onChange={e => handleChangeSearchRange(e.target.value, 'startDate')}
        onBlur={validateChangesOnSearchRangeLeave}
      />
      to
      <input
        aria-label="end date picker"
        className="mx-2 mb-2 rounded-lg bg-sky-100/80 px-1"
        type="date"
        readOnly={searchRange.startDate == null}
        value={searchRangeIsNull ? undefined : parseDateToInputString(searchRange.endDate)}
        min={parseDateToInputString(minTo)}
        max={parseDateToInputString(maxTo)}
        onChange={e => handleChangeSearchRange(e.target.value, 'endDate')}
        onBlur={validateChangesOnSearchRangeLeave}
      />
    </>
  );
}
