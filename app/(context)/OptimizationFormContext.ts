import { createContext, useContext } from 'react';
import { DateValueType } from 'react-tailwindcss-datepicker';
import { OptimalVacation } from '../algorithm/algorithm';
import { DateRange } from '../types/datetime';

interface OptimizationFormContextProps {
  duration: number;
  interval: {
    from: Date;
    to: Date;
  };
  handleChangeDuration(newDuration: number): void;
  handleClickToFindVacation(): void;
  handleSearchRange: (newValue: DateValueType) => void;
  optimalVacation?: OptimalVacation;
  searchRange: DateRange | { startDate: null; endDate: null };
}

export const OptimizationFormContext = createContext<OptimizationFormContextProps | null>(null);

export function useOptimizationFormContext() {
  const context = useContext(OptimizationFormContext);
  if (context == null) throw new Error('OptimizationFormContext cannot be null');

  return context;
}
