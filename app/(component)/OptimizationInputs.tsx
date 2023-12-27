import { useOptimizationFormContext } from '../(context)/OptimizationFormContext';
import { DateRangePicker } from './DateRangePicker';

export function OptimizationInputs() {
  const { duration, handleChangeDuration, handleClickToFindVacation, searchRange, validationMessage } =
    useOptimizationFormContext();

  const searchRangeIsNull = searchRange.startDate == null || searchRange.endDate == null;

  return (
    <section className="mx-6 flex flex-col items-center gap-3 text-center">
      <p className="break-words text-center sm:mb-3">
        I will take
        <input
          aria-label="Input to select number of days-off to be taken"
          className="mx-2 mb-2 w-7 rounded-lg bg-sky-100/80 pl-1 focus:outline-none tiny:w-10 sm:w-14"
          type="numeric"
          min="0"
          value={duration}
          onChange={e => handleChangeDuration(Number(e.target.value))}
        />
        days off, anywhere from
        <DateRangePicker />
      </p>
      {validationMessage ? (
        <p className="underline decoration-red-500 decoration-4 underline-offset-8 md:max-w-2xl">{validationMessage}</p>
      ) : null}
      <div className="mt-7 flex w-full justify-center">
        <button
          aria-label="Get the best time!"
          className="enabled:optimization-button rounded-full px-6 py-3 text-base text-white transition-colors duration-300 hover:text-sky-950 disabled:bg-sky-300/40 disabled:text-sky-950/40 tiny:text-xl sm:text-3xl"
          onClick={handleClickToFindVacation}
          disabled={searchRangeIsNull || !!validationMessage}>
          Get the best time!
        </button>
      </div>
    </section>
  );
}
