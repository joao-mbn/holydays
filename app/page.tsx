'use client';

import Image from 'next/image';
import { useState } from 'react';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import background from '../public/sunny-background.jpg';
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

  const [optimalVacation, setOptimalVacation] = useState<OptimalVacation>();

  const [searchRange, setSearchRange] = useState<DateRange | { startDate: null; endDate: null }>({
    startDate: new Date(today),
    endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
  });

  const handleSearchRange = (newValue: DateValueType) => {
    if (newValue == null || newValue.startDate == null || newValue.endDate == null) {
      setSearchRange({ startDate: null, endDate: null });
      return;
    }

    const { startDate, endDate } = newValue;

    const _searchRange = {
      startDate: startDate instanceof Date ? startDate : parseInputStringToDate(startDate),
      endDate: endDate instanceof Date ? endDate : parseInputStringToDate(endDate),
    };

    setSearchRange(_searchRange);

    setOptimalVacation(
      findOptimalVacation({
        lowerLimit: _searchRange.startDate,
        upperLimit: _searchRange.endDate,
        duration: duration,
      })
    );
  };

  function handleChangeDuration(newDuration: number) {
    if (newDuration == null || newDuration < 5 || newDuration > 30) return;

    setDuration(newDuration);

    const { startDate, endDate } = searchRange;
    if (startDate != null && endDate != null) {
      setOptimalVacation(
        findOptimalVacation({
          lowerLimit: searchRange.startDate,
          upperLimit: searchRange.endDate,
          duration: newDuration,
        })
      );
    }
  }

  return (
    <main className="relative flex flex-col items-center gap-6 font-sans">
      <Image alt="Beach Scene" src={background} priority className="absolute -z-10 object-cover opacity-70" />
      <header className="flex flex-col items-center gap-2 py-6 font-display text-sky-950">
        <h1 className="text-8xl">Holydays</h1>
        <h2 className="text-3xl font-semibold">Get the most out of your vacations!</h2>
      </header>
      <section className="flex w-3/5 flex-col items-center gap-2 rounded-3xl bg-sky-50/50 backdrop-blur-lg">
        <div>
          <span>I will take</span>
          <input
            className="mx-2 h-5 w-10 rounded-lg bg-sky-50/70 pl-1 focus:outline-none"
            type="number"
            min="5"
            max="30"
            value={duration}
            onChange={e => handleChangeDuration(Number(e.target.value))}
          />
          <span>days off,</span>
        </div>
        <div className="flex gap-2">
          <span>anywhere from</span>
          <Datepicker
            i18n="en"
            popoverDirection="down"
            minDate={interval.from}
            maxDate={interval.to}
            containerClassName="relative h-5 w-80"
            inputClassName="relative h-5 w-full rounded-lg bg-sky-50 bg-sky-50/70 py-1 pl-1 pr-14 text-sm placeholder-gray-400 outline-none transition-all duration-300"
            toggleClassName="h-5text-sky-100 absolute right-0 translate-y-1 bg-sky-800 px-3 text-sky-100"
            value={{
              startDate: searchRange?.startDate == null ? null : parseDateToInputString(searchRange.startDate),
              endDate: searchRange?.endDate == null ? null : parseDateToInputString(searchRange.endDate),
            }}
            onChange={handleSearchRange}
            separator="to"
            readOnly
            displayFormat="DD-MMM-YYYY"
          />
        </div>
        <button>Find the best time for me!</button>
      </section>
      {optimalVacation ? (
        <section className="flex w-3/5 flex-col items-center gap-2 rounded-3xl bg-sky-50">
          <h2>Your optimized vacation is</h2>
          <span>From {optimalVacation.vacationStart.toLocaleDateString()} </span>
          <span>To {optimalVacation.vacationEnd.toLocaleDateString()}.</span>
          <span>
            {' '}
            You have got {Math.round(optimalVacation.investmentGainRatio * duration)} of continuous free days by
            investing {duration} of paid vacation days!
          </span>
        </section>
      ) : null}
    </main>
  );
}
