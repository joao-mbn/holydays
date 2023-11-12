import Datepicker from 'react-tailwindcss-datepicker';
import { useOptimizationFormContext } from '../(context)/OptimizationFormContext';
import { parseDateToInputString } from '../utils/datetime';

export function OptimizationInputs() {
  const {
    duration,
    handleChangeDuration,
    handleClickToFindVacation,
    handleChangeSearchRange,
    interval,
    searchRange,
    validationMessage,
  } = useOptimizationFormContext();

  const searchRangeIsNull = searchRange.startDate == null || searchRange.endDate == null;

  return (
    <section className="mx-6 flex flex-col items-center gap-3 text-center text-xl sm:text-2xl">
      <div>
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
      </div>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-0">
        <span>anywhere from</span>
        <Datepicker
          i18n="en"
          popoverDirection="down"
          placeholder="today to the next 365 days"
          primaryColor="sky"
          minDate={interval.from}
          maxDate={interval.to}
          containerClassName="relative pl-2"
          inputClassName={
            'relative w-80 flex-grow rounded-lg bg-sky-100/80 py-1 pl-2 outline-none transition-all duration-300 placeholder:text-sky-950/60 sm:w-[23rem]'
          }
          toggleClassName="absolute right-0 h-full rounded-br-lg rounded-tr-lg bg-sky-950 px-3 text-sky-50"
          value={{
            startDate: searchRangeIsNull ? null : parseDateToInputString(searchRange.startDate),
            endDate: searchRangeIsNull ? null : parseDateToInputString(searchRange.endDate),
          }}
          onChange={handleChangeSearchRange}
          separator="to"
          readOnly
          displayFormat="MM/DD/YYYY"
        />
      </div>
      {validationMessage ? (
        <p className="sm:leading-12 leading-10 underline decoration-red-500 decoration-4 underline-offset-8 md:max-w-2xl">
          {validationMessage}
        </p>
      ) : null}
      <div className="mt-7 flex w-full justify-center">
        <button
          className="enabled:optimization-button rounded-full px-6 py-3 text-xl font-bold text-white transition-colors duration-300 hover:text-sky-950 disabled:bg-sky-300/40 disabled:text-sky-950/40 sm:text-3xl sm:font-normal"
          onClick={handleClickToFindVacation}
          disabled={searchRangeIsNull || !!validationMessage}>
          Find the best time for me!
        </button>
      </div>
    </section>
  );
}
