import { useEffect } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import { useOptimizationFormContext } from '../(context)/OptimizationFormContext';
import { parseDateToInputString } from '../utils/datetime';

export function DatePicker() {
  const { handleChangeSearchRange, interval, searchRange } = useOptimizationFormContext();

  const searchRangeIsNull = searchRange.startDate == null || searchRange.endDate == null;

  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>('div.datepicker-container input');

    input?.setAttribute('aria-label', "Date Picker's date range input");
    input?.setAttribute('role', 'textbox');
  }, []);

  useEffect(() => {
    document
      .querySelector<HTMLButtonElement>('div.datepicker-container button')
      ?.setAttribute('aria-label', searchRangeIsNull ? 'Pick a date range button' : 'Remove date range from input');
  }, [searchRangeIsNull]);

  return (
    <Datepicker
      i18n="en"
      popoverDirection="down"
      placeholder="today to the next 365 days"
      primaryColor="sky"
      minDate={interval.from}
      maxDate={interval.to}
      containerClassName="datepicker-container relative h-full max-w-full"
      inputClassName={
        'tiny:h-9 tiny:w-[17rem] relative h-8 w-[14rem] max-w-full rounded-lg bg-sky-100/80 py-1 pl-1 outline-none transition-all duration-300 placeholder:text-sky-950/60 sm:h-10 sm:w-[23rem]'
      }
      toggleClassName="tiny:translate-y-[0.125rem] tiny:h-9 absolute right-0 h-8 rounded-br-lg rounded-tr-lg bg-sky-950 px-3 text-sky-50 sm:h-10 sm:translate-y-[0.25rem]"
      value={{
        startDate: searchRangeIsNull ? null : parseDateToInputString(searchRange.startDate),
        endDate: searchRangeIsNull ? null : parseDateToInputString(searchRange.endDate),
      }}
      onChange={handleChangeSearchRange}
      separator="to"
      readOnly
      displayFormat="MM/DD/YYYY"
    />
  );
}
