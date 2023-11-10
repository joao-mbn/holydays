'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { OptimalVacation, findOptimalVacation } from './algorithm/algorithm';
import { DateRange } from './types/datetime';
import { parseDateToInputString, parseInputStringToDate } from './utils/datetime';

export default function Home() {
  const today = new Date();
  const interval = {
    from: new Date(today),
    to: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
  };

  const [duration, setDuration] = useState(10);
  const [searchRange, setSearchRange] = useState<DateRange | { startDate: null; endDate: null }>({
    startDate: new Date(today),
    endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
  });

  const searchRangeIsNull = searchRange.startDate == null || searchRange.endDate == null;

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

  const handleSearchRange = (newValue: DateValueType) => {
    if (newValue == null || newValue.startDate == null || newValue.endDate == null) {
      setSearchRange({ startDate: null, endDate: null });
    } else {
      const { startDate, endDate } = newValue;

      setSearchRange({
        startDate: startDate instanceof Date ? startDate : parseInputStringToDate(startDate),
        endDate: endDate instanceof Date ? endDate : parseInputStringToDate(endDate),
      });
    }

    setOptimalVacation(undefined);
  };

  function handleChangeDuration(newDuration: number) {
    if (newDuration == null || newDuration < 5 || newDuration > 30) return;

    setDuration(newDuration);
    setOptimalVacation(undefined);
  }

  return (
    <main className="relative flex h-screen w-screen flex-col items-center gap-6 overflow-hidden font-sans text-sky-950">
      <Image alt="Beach Scene" src="/bg-16-9.png" priority fill className="absolute object-cover" />
      <div className="z-10 flex h-full w-full flex-col gap-20 bg-white/60 backdrop-brightness-125">
        <header className="mt-10 flex flex-col items-center gap-2 font-display">
          <h1 className="text-8xl">Holydays</h1>
          <h2 className="text-3xl font-semibold">Get the most out of your vacations</h2>
        </header>
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
              className="enabled:optimization-button rounded-full px-6 py-3 text-3xl text-sky-950 transition-colors duration-300 hover:text-white disabled:bg-sky-300/40 disabled:text-sky-950/40"
              onClick={handleClickToFindVacation}
              disabled={searchRangeIsNull}>
              Find the best time for me!
            </button>
          </div>
        </section>
        {optimalVacation ? (
          <section className="mt-10 flex justify-center text-2xl leading-loose">
            <p className="w-3/4 text-center lg:w-1/2">
              Schedule your vacations from
              <span className="gradient-underline gradient-violet-red m-2">
                {optimalVacation.vacationStart.toLocaleDateString()}
              </span>
              to
              <span className="gradient-underline gradient-fuchsia-amber m-2">
                {optimalVacation.vacationEnd.toLocaleDateString()}
              </span>
              and you will get
              <span className="m-2 rounded-full bg-gradient-to-bl from-red-500 from-10% via-orange-500 via-60% to-yellow-500 to-80% px-4 py-1 text-white">
                {Math.round(optimalVacation.investmentGainRatio * duration)}
              </span>
              continuous free days.
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
