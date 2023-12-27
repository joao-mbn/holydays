import { createContext, useContext } from 'react';
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
  handleChangeSearchRange: (newDate: string, position: keyof DateRange) => void;
  optimalVacation?: OptimalVacation;
  searchRange: DateRange | { startDate: null; endDate: null };
  validationMessage: string;
  allowedRange: {
    minFrom: Date;
    maxFrom: Date;
    minTo: Date;
    maxTo: Date;
  };
  validateChangesOnSearchRangeLeave: () => void;
}

export const OptimizationFormContext = createContext<OptimizationFormContextProps | null>(null);

export function useOptimizationFormContext() {
  const context = useContext(OptimizationFormContext);
  if (context == null) throw new Error('OptimizationFormContext cannot be null');

  return context;
}
