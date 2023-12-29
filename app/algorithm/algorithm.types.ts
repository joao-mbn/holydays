export type CommonArgs = {
  navigatorLanguages: string[];
  lowerLimit: Date;
  upperLimit: Date;
};

export type GetHolidaysArgs = CommonArgs & {
  currentYear: number;
};

export type FindOptimalVacationArgs = CommonArgs & {
  duration: number;
  isClt?: boolean;
  swapThurdaysAndTuesdaysHolidays?: boolean;
};

export type OptimalVacation = {
  vacationStart: Date;
  vacationEnd: Date;
  investmentGainRatio: number;
};

export type ValidateLimitArgs = Pick<CommonArgs, 'lowerLimit' | 'upperLimit'> & {
  today: Date;
  nextYearLastDayDate: Date;
};
