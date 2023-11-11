import { useOptimizationFormContext } from '../(context)/OptimizationFormContext';

export function OptimizationOutputs() {
  const { optimalVacation, duration } = useOptimizationFormContext();

  if (!optimalVacation) return null;

  const { vacationStart, vacationEnd, investmentGainRatio } = optimalVacation;

  return (
    <section className="mt-10 flex justify-center text-2xl leading-loose">
      <p className="w-3/4 text-center lg:w-1/2">
        Schedule your vacations from
        <span className="gradient-underline gradient-violet-red m-2">{vacationStart.toLocaleDateString()}</span>
        to
        <span className="gradient-underline gradient-fuchsia-amber m-2">{vacationEnd.toLocaleDateString()}</span>
        and you will get
        <span className="m-2 rounded-full bg-gradient-to-bl from-red-500 from-10% via-orange-500 via-60% to-yellow-500 to-80% px-4 py-1 text-white">
          {Math.round(investmentGainRatio * duration)}
        </span>
        continuous free days.
      </p>
    </section>
  );
}
