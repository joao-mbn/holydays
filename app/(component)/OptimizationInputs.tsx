import { useOptimizationFormContext } from '../(context)/OptimizationFormContext';
import { DatePicker } from './DatePicker';

export function OptimizationInputs() {
  const { duration, handleChangeDuration, handleClickToFindVacation, searchRange, validationMessage } =
    useOptimizationFormContext();

  const searchRangeIsNull = searchRange.startDate == null || searchRange.endDate == null;

  return (
    <section className="mx-6 flex flex-col items-center gap-3 text-center">
      <div>
        <div className="sm:mb-3">
          <span>I will take</span>
          <input
            aria-label="Input to select number of days-off to be taken"
            className="tiny:w-10 mx-2 w-8 rounded-lg bg-sky-100/80 pl-1 focus:outline-none sm:w-14"
            type="numeric"
            min="0"
            value={duration}
            onChange={e => handleChangeDuration(Number(e.target.value))}
          />
          <span>days off,</span>
        </div>
        <div className="flex max-w-full flex-wrap items-center justify-center gap-x-1 gap-y-1">
          <span>anywhere from</span>
          <DatePicker />
        </div>
      </div>
      {validationMessage ? (
        <p className="underline decoration-red-500 decoration-4 underline-offset-8 md:max-w-2xl">{validationMessage}</p>
      ) : null}
      <div className="mt-7 flex w-full justify-center">
        <button
          aria-label="Get the best time!"
          className="enabled:optimization-button tiny:text-xl rounded-full px-6 py-3 text-base text-white transition-colors duration-300 hover:text-sky-950 disabled:bg-sky-300/40 disabled:text-sky-950/40 sm:text-3xl"
          onClick={handleClickToFindVacation}
          disabled={searchRangeIsNull || !!validationMessage}>
          Get the best time!
        </button>
      </div>
    </section>
  );
}
