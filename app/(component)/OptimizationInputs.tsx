import { useOptimizationFormContext } from '../(context)/OptimizationFormContext';
import { DatePicker } from './DatePicker';

export function OptimizationInputs() {
  const { duration, handleChangeDuration, handleClickToFindVacation, searchRange, validationMessage } =
    useOptimizationFormContext();

  const searchRangeIsNull = searchRange.startDate == null || searchRange.endDate == null;

  return (
    <section className="mx-6 flex flex-col items-center gap-3 text-center text-xl sm:text-2xl">
      <div>
        <span>I will take</span>
        <input
          aria-label="Input to select number of days-off to be taken"
          className="mx-2 w-14 rounded-lg bg-sky-100/80 pl-1 focus:outline-none"
          type="numeric"
          min="0"
          value={duration}
          onChange={e => handleChangeDuration(Number(e.target.value))}
        />
        <span>days off,</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-0">
        <span>anywhere from</span>
        <DatePicker />
      </div>
      {validationMessage ? (
        <p className="leading-10 underline decoration-red-500 decoration-4 underline-offset-8 sm:leading-12 md:max-w-2xl">
          {validationMessage}
        </p>
      ) : null}
      <div className="mt-7 flex w-full justify-center">
        <button
          aria-label="Find the best time for me!"
          className="enabled:optimization-button rounded-full px-6 py-3 text-xl font-bold text-white transition-colors duration-300 hover:text-sky-950 disabled:bg-sky-300/40 disabled:text-sky-950/40 sm:text-3xl sm:font-normal"
          onClick={handleClickToFindVacation}
          disabled={searchRangeIsNull || !!validationMessage}>
          Find the best time for me!
        </button>
      </div>
    </section>
  );
}
