'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import background from '../public/bg-16-9.png';
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

  const [optimalVacation, setOptimalVacation] = useState<OptimalVacation>();

  function handleClickToFindVacation() {
    const { startDate, endDate } = searchRange;
    if (!startDate || !endDate) return;

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
  };

  function handleChangeDuration(newDuration: number) {
    if (newDuration == null || newDuration < 5 || newDuration > 30) return;

    setDuration(newDuration);
  }

  return (
    <main className="relative flex h-screen w-screen flex-col items-center gap-6 overflow-hidden font-sans text-sky-950">
      <Image alt="Beach Scene" src={background} priority className="absolute object-cover" />
      <div className="z-10 flex h-full w-full flex-col gap-20 bg-white/50 backdrop-brightness-125">
        <header className="mt-10 flex flex-col items-center gap-2 font-display">
          <h1 className="text-8xl">Holydays</h1>
          <h2 className="text-3xl font-semibold">Get the most out of your vacations!</h2>
        </header>
        <section>
          <div className="mb-5 flex items-center justify-center text-2xl">
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
          <div className="flex items-center justify-center text-2xl">
            <span>anywhere from</span>
            <Datepicker
              i18n="en"
              popoverDirection="down"
              minDate={interval.from}
              maxDate={interval.to}
              containerClassName="relative pl-2"
              inputClassName={classNames(
                'relative flex-grow rounded-lg bg-sky-100/80 py-1 pl-2 outline-none transition-all duration-300',
                { 'w-[30rem]': !searchRange.startDate || !searchRange.endDate },
                { 'w-[25rem]': searchRange.startDate && searchRange.endDate }
              )}
              toggleClassName="absolute right-0 h-full rounded-br-lg rounded-tr-lg bg-sky-950 px-3 text-sky-50"
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
          <div className="mt-5 flex w-full justify-center">
            <button
              className="optimization-button rounded-full px-6 py-3 text-2xl text-cyan-950 transition-colors duration-300 hover:text-orange-950"
              onClick={handleClickToFindVacation}>
              Find the best time for me!
            </button>
          </div>
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
      </div>
    </main>
  );
}
