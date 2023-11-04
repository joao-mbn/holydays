'use client';

import { useMemo, useRef, useState } from 'react';
import { OptimalVacation, findOptimalVacation } from './algorithm/algorithm';
import { parseDateToInputString, parseInputStringToDate } from './utils/datetime';

export default function Home() {
  const currentDate = useMemo(() => new Date(), []);

  const interval = useRef({
    from: new Date(currentDate),
    to: new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate()),
  });

  const duration = useRef(10);

  const [optimalVacation, setOptimalVacation] = useState<OptimalVacation>();

  function setVacation() {
    setOptimalVacation(
      findOptimalVacation({
        lowerLimit: interval.current.from,
        upperLimit: interval.current.to,
        duration: duration.current,
      })
    );
  }

  return (
    <main>
      <h1>Get the most value out of your vacations!</h1>
      <fieldset>
        <h2 className="pb-2">Select the interval you are considering taking your vacations</h2>
        <div className="flex gap-2">
          <label>
            From
            <input
              className="bg-slate-200 ml-2"
              type="date"
              value={parseDateToInputString(interval.current.from)}
              onChange={e => {
                const from = parseInputStringToDate(e.target.value);
                if (from.getTime() >= interval.current.to.getTime()) return;

                interval.current.from = from;
                setVacation();
              }}
            />
          </label>
          <label>
            To
            <input
              className="bg-slate-200 ml-2"
              type="date"
              value={parseDateToInputString(interval.current.to)}
              onChange={e => {
                const to = new Date(Date.parse(e.target.value));
                if (to.getTime() <= interval.current.from.getTime()) return;

                interval.current.to = to;
                setVacation();
              }}
            />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <label>
          Select how many days-off you are intending to take:
          <input
            className="bg-slate-200 ml-2"
            type="number"
            min="5"
            max="30"
            value={duration.current}
            onChange={e => {
              const newDuration = Number(e.target.value);
              if (newDuration == null || newDuration < 5 || newDuration > 30) return;

              duration.current = newDuration;
              setVacation();
            }}
          />
        </label>
      </fieldset>
      {optimalVacation ? (
        <section>
          <h2>Your optimized vacation is</h2>
          <span>From {optimalVacation.vacationStart.toLocaleDateString()} </span>
          <span>To {optimalVacation.vacationEnd.toLocaleDateString()}.</span>
          <span>
            {' '}
            You have got {Math.round(optimalVacation.investmentGainRatio * duration.current)} of continuous free days by
            investing {duration.current} of paid vacation days!
          </span>
        </section>
      ) : null}
    </main>
  );
}

