import { useOptimizationFormContext } from './OptimizationFormContext';

export function OptimizationOutputs() {
  const { optimalVacation, duration } = useOptimizationFormContext();

  if (!optimalVacation) return <div></div>;

  const { vacationStart, vacationEnd, investmentGainRatio } = optimalVacation;

  return (
    <section className="flex w-full justify-center" data-testid="output-section">
      <p className="mx-6 break-words text-center md:max-w-2xl">
        Schedule your vacations from
        <span className="gradient-underline gradient-violet-red m-2" data-testid="vacation-start">
          {vacationStart.toLocaleDateString()}
        </span>
        to
        <span className="gradient-underline gradient-fuchsia-amber m-2" data-testid="vacation-end">
          {vacationEnd.toLocaleDateString()}
        </span>
        and you will get
        <span
          data-testid="vacation-duration"
          className="m-2 rounded-full bg-gradient-to-bl from-red-500 from-10% via-orange-500 via-60% to-yellow-500 to-80% px-4 py-1 text-white">
          {Math.round(investmentGainRatio * duration)}
        </span>
        continuous free days.
      </p>
    </section>
  );
}
