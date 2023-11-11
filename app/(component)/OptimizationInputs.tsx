import classNames from 'classnames';
import Datepicker from 'react-tailwindcss-datepicker';
import { useOptimizationFormContext } from '../(context)/OptimizationFormContext';
import { parseDateToInputString } from '../utils/datetime';

export function OptimizationInputs() {
  const { duration, handleChangeDuration, handleClickToFindVacation, handleSearchRange, interval, searchRange } =
    useOptimizationFormContext();

  const searchRangeIsNull = searchRange.startDate == null || searchRange.endDate == null;

  return (
    <section>
      <p className="mb-3 text-center text-2xl">
        <span>I will take</span>
        <input
          className="mx-2 w-14 rounded-lg bg-sky-100/80 pl-1 focus:outline-none"
          type="number"
          min="5"
          max="30"
          value={duration}
          onChange={e => handleChangeDuration(Number(e.target.value))}
        />
        <span>days off,</span>
      </p>
      <div className="flex items-center justify-center text-2xl">
        <span>anywhere from</span>
        <Datepicker
          i18n="en"
          popoverDirection="down"
          placeholder="today to the next 365 days"
          primaryColor="sky"
          minDate={interval.from}
          maxDate={interval.to}
          containerClassName="relative pl-2"
          inputClassName={classNames(
            'relative flex-grow rounded-lg bg-sky-100/80 py-1 pl-2 outline-none transition-all duration-300 placeholder:text-sky-950/60',
            { 'w-[23rem]': searchRangeIsNull },
            { 'w-[22rem]': !searchRangeIsNull }
          )}
          toggleClassName="absolute right-0 h-full rounded-br-lg rounded-tr-lg bg-sky-950 px-3 text-sky-50"
          value={{
            startDate: searchRangeIsNull ? null : parseDateToInputString(searchRange.startDate),
            endDate: searchRangeIsNull ? null : parseDateToInputString(searchRange.endDate),
          }}
          onChange={handleSearchRange}
          separator="to"
          readOnly
          displayFormat="MM/DD/YYYY"
        />
      </div>
      <div className="mt-10 flex w-full justify-center">
        <button
          className="enabled:optimization-button rounded-full px-6 py-3 text-3xl text-white transition-colors duration-300 hover:text-sky-950 disabled:bg-sky-300/40 disabled:text-sky-950/40"
          onClick={handleClickToFindVacation}
          disabled={searchRangeIsNull}>
          Find the best time for me!
        </button>
      </div>
    </section>
  );
}
